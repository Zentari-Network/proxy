import ConfigHandler from "../config/handler";
import DatabaseHandler from "../database/handler";
import DatabaseUtils from "../database/utils";
import type { VPN, VPNAPISuccess } from "./types";

export default abstract class VPNHandler {
  public static async GetVPN(ip: string): Promise<VPN | undefined> {
    const stored = await DatabaseUtils.GetVPN(ip);

    if (stored) {
      return stored;
    }

    const request = await fetch(
      `https://vpnapi.io/api/${ip}?key=${ConfigHandler.GetAPIToken()}`,
      {
        method: "GET",
      },
    );
    const body = (await request.json()) as VPNAPISuccess;

    if ("message" in body) {
      console.error(`Error while checking if ${ip} is a VPN: ${body.message}`);
      return;
    }

    const vpn = Object.values(body.security).some((value) => value);

    await DatabaseHandler.Query(
      "INSERT INTO vpns (ip, vpn, asn, aso, city, region) VALUES (?, ?, ?, ?, ?, ?)",
      ip,
      vpn,
      body.network.autonomous_system_number,
      body.network.autonomous_system_organization,
      body.location.city,
      body.location.region,
    );

    return {
      ip,
      vpn,
      asn: body.network.autonomous_system_number,
      aso: body.network.autonomous_system_organization,
      city: body.location.city,
      region: body.location.region,
      whitelisted: false,
      created_at: new Date().toISOString(),
    };
  }
  public static IsPrivate(ip: string): boolean {
    const octets = ip.trim().split(".").map(Number) as [
      number,
      number,
      number,
      number,
    ];

    if (
      octets.length !== 4 ||
      octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)
    ) {
      return false;
    }

    const [a, b] = octets;

    return (
      a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
    );
  }
}
