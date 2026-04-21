import type { Profile } from "../../api/routers/checker/checker.types";
import type { VPN } from "../VPN/types";
import DatabaseHandler from "./handler";

export default abstract class DatabaseUtils {
  public static async GetVPN(ip: string): Promise<VPN | undefined> {
    const request = await DatabaseHandler.Select<VPN[]>(
      "SELECT * FROM vpns WHERE ip = ? LIMIT 1",
      ip,
    );

    return request[0];
  }
  public static async GetProfile(xuid: string): Promise<Profile | undefined> {
    const request = await DatabaseHandler.Select<Profile[]>(
      "SELECT * FROM profiles WHERE xuid = ? LIMIT 1",
      xuid,
    );

    return request[0];
  }
  public static async GetProfilesFromIP(ip: string): Promise<Profile[]> {
    const request = await DatabaseHandler.Select<Profile[]>(
      "SELECT * FROM profiles WHERE ip = ?",
      ip,
    );

    return request;
  }
}
