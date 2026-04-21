import type { Config } from "./types";

export default class ConfigHandler {
  private static config: Config;

  public constructor() {
    this.Init();
  }

  private Init(): void {
    const { API_TOKEN } = process.env;

    if (!API_TOKEN) {
      throw new Error("API_TOKEN is not defined");
    }

    const config: Config = {
      APIToken: API_TOKEN,
    };

    ConfigHandler.config = config;
  }

  public static GetAPIToken(): string {
    return ConfigHandler.config.APIToken;
  }
}
