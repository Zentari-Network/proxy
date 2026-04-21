export default class ExitHandler {
  public constructor() {
    this.Init();
  }

  private Init(): void {
    process.once("SIGTERM", () => {
      console.log("Shutting down...");

      process.exit();
    });
  }
}
