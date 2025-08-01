import "@opentelemetry/auto-instrumentations-node/register";

import { Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserRepository } from "../repositories/user.repository";
import {
  UserNotFoundException,
  UserAlreadyExistsException
} from "src/common/custom.exceptions";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(createUserDto.email);
    }

    const hashedPassword = await hash(createUserDto.password, 6);

    const userEntity = UserEntity.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.create(userEntity);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.getUserById(id);

    if (updateUserDto.email) {
      const userWithEmail = await this.userRepository.findByEmailExcludingId(
        updateUserDto.email,
        id
      );
      if (userWithEmail) {
        throw new UserAlreadyExistsException(updateUserDto.email);
      }
    }

    const updateData: Partial<UpdateUserDto> = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await hash(updateUserDto.password, 6);
    }

    return this.userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);

    return this.userRepository.delete(id);
  }

  async listUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}