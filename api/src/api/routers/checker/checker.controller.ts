import type { Request, Response } from "express";
import DatabaseConstants from "../../../utils/database/constants";
import DatabaseHandler from "../../../utils/database/handler";
import DatabaseUtils from "../../../utils/database/utils";
import Sleep from "../../../utils/sleep";
import VPNHandler from "../../../utils/VPN/handler";
import type { CheckRequest, CheckResponse } from "./checker.types";

export default abstract class CheckerController {
  public static async Check(req: Request, res: Response): Promise<void> {
    const { ip, username, xuid }: CheckRequest = req.body;

    if (!ip || !username || !xuid) {
      res.status(400).json({
        message: "Missing required fields!",
      });
      return;
    }

    const profile = await DatabaseUtils.GetProfile(xuid);

    if (!profile) {
      await DatabaseHandler.Query(
        "INSERT INTO profiles (xuid, username, ip) VALUES (?, ?, ?)",
        xuid,
        username,
        ip,
      );

      await Sleep(100);

      CheckerController.Check(req, res);
      return;
    }

    const alts = (await DatabaseUtils.GetProfilesFromIP(ip)).filter(
      (entry) => entry.xuid !== xuid,
    );

    const response: CheckResponse = {
      allowed: true,
      message: "Clean member.",
    };

    if (profile.whitelisted) {
      response.allowed = true;
      response.message = "Whitelisted member.";

      res.json(response);
      return;
    }

    const isPrivate = VPNHandler.IsPrivate(ip);

    if (alts.length > 0) {
      response.allowed = false;
      response.message = "Alt detected.";

      res.json(response);
      return;
    }
    if (!isPrivate) {
      const vpn = await VPNHandler.GetVPN(ip);

      if (vpn?.vpn && !vpn?.whitelisted) {
        response.allowed = false;
        response.message = "VPN detected.";

        res.json(response);
        return;
      }
      if (DatabaseConstants.BannedASNs.includes(vpn!.asn)) {
        response.allowed = false;
        response.message = "Banned ASN.";

        res.json(response);
        return;
      }
    }

    res.json(response);
  }
}
