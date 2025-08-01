import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Injectable } from "@nestjs/common";
import * as schema from "./schemas";

@Injectable()
export class DatabaseClient {
  private _client: ReturnType<typeof drizzle>;

  constructor() {
    this._client = drizzle(process.env.DATABASE_URL!, {
      schema: schema.schema,
      logger: true,
      casing: "snake_case",
    });
  }

  async connect() {
    await this._client.execute(sql`SELECT 1`);
  }

  async disconnect() {
    await this._client.$client.end();
  }

  get client() {
    return this._client;
  }

  async getClient() {
    return this._client;
  }
}