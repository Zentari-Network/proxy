import type { Request, Response } from "express";
import VPNHandler from "../../../utils/VPN/handler";
import type { CheckRequest, CheckResponse } from "./checker.types";

export default abstract class CheckerController {
  public static async Check(req: Request, res: Response): Promise<void> {
    const { ip }: CheckRequest = req.body;

    if (!ip) {
      res.status(400).json({
        message: "Missing required fields!",
      });
      return;
    }

    let response: CheckResponse = {
      allowed: true,
      message: "Clean member.",
    };
    const isPrivate = VPNHandler.IsPrivate(ip);

    if (!isPrivate) {
      const vpn = await VPNHandler.GetVPN(ip);

      if (vpn?.vpn && !vpn?.whitelisted) {
        response = {
          allowed: false,
          message: "VPN detected.",
        };
      }
    }

    res.json(response);
  }
}
