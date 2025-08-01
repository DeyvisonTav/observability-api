import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { schema } from "src/database/schemas";

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: User) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: Omit<User, "id" | "createdAt" | "updatedAt">) {
    return new UserEntity({
      ...props,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
} 