import { BaseRepository } from 'src/common/interfaces/base-repository.interface';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';

export interface IUserRepository extends BaseRepository<UserEntity, UserEntity, UpdateUserDto> {
  findByEmail(email: string): Promise<UserEntity | null>;
  emailExists(email: string): Promise<boolean>;
  findByEmailExcludingId(email: string, excludeId: string): Promise<UserEntity | null>;
} 