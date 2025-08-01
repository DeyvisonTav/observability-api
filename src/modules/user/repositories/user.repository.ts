import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseClient } from 'src/database/client';
import { schema } from 'src/database/schemas';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { IUserRepository } from '../interfaces/user-repository.interface';
import {
  UserNotFoundException,
  DatabaseConnectionException
} from 'src/common/custom.exceptions';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly databaseClient: DatabaseClient) { }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    try {
      const [createdUser] = await this.databaseClient.client
        .insert(schema.users)
        .values(userEntity)
        .returning();

      return createdUser;
    } catch (error) {
      throw new DatabaseConnectionException('criar usuário');
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const [user] = await this.databaseClient.client
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id));

      return user || null;
    } catch (error) {
      throw new DatabaseConnectionException('buscar usuário por ID');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.databaseClient.client.select().from(schema.users);
      return users;
    } catch (error) {
      throw new DatabaseConnectionException('listar usuários');
    }
  }

  async update(id: string, updateData: Partial<UpdateUserDto>): Promise<UserEntity> {
    try {
      const [updatedUser] = await this.databaseClient.client
        .update(schema.users)
        .set(updateData)
        .where(eq(schema.users.id, id))
        .returning();

      if (!updatedUser) {
        throw new UserNotFoundException(id);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new DatabaseConnectionException('atualizar usuário');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.databaseClient.client
        .delete(schema.users)
        .where(eq(schema.users.id, id));
    } catch (error) {
      throw new DatabaseConnectionException('remover usuário');
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const user = await this.findById(id);
      return user !== null;
    } catch (error) {
      throw new DatabaseConnectionException('verificar existência do usuário');
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const [user] = await this.databaseClient.client
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      return user || null;
    } catch (error) {
      throw new DatabaseConnectionException('buscar usuário por email');
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      throw new DatabaseConnectionException('verificar existência do email');
    }
  }

  async findByEmailExcludingId(email: string, excludeId: string): Promise<UserEntity | null> {
    try {
      const user = await this.findByEmail(email);
      return user && user.id !== excludeId ? user : null;
    } catch (error) {
      throw new DatabaseConnectionException('buscar usuário por email excluindo ID');
    }
  }
} 