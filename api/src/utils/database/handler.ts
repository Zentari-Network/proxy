import { createPool, type Pool } from "mysql2";
import DatabaseConstants from "./constants";

export default class DatabaseHandler {
  private static connection: Pool;

  public constructor() {
    this.Init();
  }

  private Init(): void {
    DatabaseHandler.connection = createPool({
      host: "172.16.0.2",
      port: 3306,
      user: "user",
      password: "password",
      database: "proxy",
      connectTimeout: 3000,
    });

    console.log("Database connected");

    this.SetupTables();
  }

  private async SetupTables(): Promise<void> {
    for (const table of DatabaseConstants.Tables) {
      await DatabaseHandler.Query(
        `CREATE TABLE IF NOT EXISTS ${table.name} (${table.columns.join(", ")})`,
      );
    }

    console.log("Database tables created.");
  }

  public static async Query(query: string, ...options: any[]): Promise<void> {
    this.connection.query(query, options, (err) => {
      if (err) {
        throw {
          message: err.message,
          query,
          options,
        };
      }
    });
  }
  public static async Select<T extends any[]>(
    query: string,
    ...options: any[]
  ): Promise<T> {
    return new Promise((resolve) => {
      this.connection.query<T>(query, options, (err, rows) => {
        if (err) {
          throw {
            message: err.message,
            query,
            options,
          };
        } else {
          resolve(rows);
        }
      });
    });
  }
}
