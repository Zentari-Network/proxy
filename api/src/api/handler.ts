import express from "express";
import CenterRouter from "./routers/center";

export default class APIHandler {
  public constructor() {
    this.Init();
  }

  private Init(): void {
    const server = express();

    server.use(express.json());
    server.use(CenterRouter);

    server.listen(3000, (err) => {
      if (err) {
        throw err;
      }

      console.log("API is running on port 3000!");
    });
  }
}
