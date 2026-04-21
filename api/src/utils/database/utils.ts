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
}
