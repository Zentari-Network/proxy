import type { Request, Response } from "express";

export default abstract class StatusController {
  public static async Get(req: Request, res: Response): Promise<void> {
    res.json({
      status: "OK",
    });
  }
}
