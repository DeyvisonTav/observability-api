import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseClient } from 'src/database/client';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, DatabaseClient],
  exports: [UserService, UserRepository],
})
export class UserModule { } 