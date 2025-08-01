import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import {
  UserNotFoundException,
  UserAlreadyExistsException,
} from '../../../common/custom.exceptions';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;
  let mockBcryptHash: jest.SpyInstance;

  const mockUser: UserEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockCreateUserDto: CreateUserDto = {
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: 'senha123',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'João Silva Santos',
    email: 'joao.silva@exemplo.com',
  };

  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailExcludingId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
    mockBcryptHash = jest.spyOn(bcrypt, 'hash');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be able to create a user', async () => {
      repository.findByEmail.mockResolvedValue(null);
      mockBcryptHash.mockResolvedValue('hashedPassword123');
      repository.create.mockResolvedValue(mockUser);

      const result = await service.createUser(mockCreateUserDto);

      expect(repository.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
      expect(mockBcryptHash).toHaveBeenCalledWith(mockCreateUserDto.password, 6);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreateUserDto.name,
          email: mockCreateUserDto.email,
          password: 'hashedPassword123',
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UserAlreadyExistsException when email already exists', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        UserAlreadyExistsException
      );
      expect(repository.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
      expect(mockBcryptHash).not.toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      repository.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById(mockUser.id);

      expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw UserNotFoundException when user not found', async () => {
      const userId = 'non-existent-id';
      repository.findById.mockResolvedValue(null);

      await expect(service.getUserById(userId)).rejects.toThrow(
        UserNotFoundException
      );
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user when found by email', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail(mockUser.email);

      expect(repository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const result = await service.getUserByEmail('inexistente@exemplo.com');

      expect(repository.findByEmail).toHaveBeenCalledWith('inexistente@exemplo.com');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      repository.findById.mockResolvedValue(mockUser);
      repository.findByEmailExcludingId.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(mockUser.id, mockUpdateUserDto);

      expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(repository.findByEmailExcludingId).toHaveBeenCalledWith(
        mockUpdateUserDto.email,
        mockUser.id
      );
      expect(repository.update).toHaveBeenCalledWith(mockUser.id, mockUpdateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should update password with hash when provided', async () => {
      const updateWithPassword: UpdateUserDto = {
        ...mockUpdateUserDto,
        password: 'novaSenha123',
      };
      const updatedUser = { ...mockUser, ...updateWithPassword };

      repository.findById.mockResolvedValue(mockUser);
      repository.findByEmailExcludingId.mockResolvedValue(null);
      mockBcryptHash.mockResolvedValue('newHashedPassword123');
      repository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(mockUser.id, updateWithPassword);

      expect(mockBcryptHash).toHaveBeenCalledWith('novaSenha123', 6);
      expect(repository.update).toHaveBeenCalledWith(mockUser.id, {
        ...updateWithPassword,
        password: 'newHashedPassword123',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw UserNotFoundException when user not exists', async () => {
      const userId = 'non-existent-id';
      repository.findById.mockResolvedValue(null);

      await expect(service.updateUser(userId, mockUpdateUserDto)).rejects.toThrow(
        UserNotFoundException
      );
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw UserAlreadyExistsException when email already exists for another user', async () => {
      const otherUser = { ...mockUser, id: 'other-user-id' };
      repository.findById.mockResolvedValue(mockUser);
      repository.findByEmailExcludingId.mockResolvedValue(otherUser);

      await expect(service.updateUser(mockUser.id, mockUpdateUserDto)).rejects.toThrow(
        UserAlreadyExistsException
      );
      expect(repository.findByEmailExcludingId).toHaveBeenCalledWith(
        mockUpdateUserDto.email,
        mockUser.id
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue(undefined);

      await service.deleteUser(mockUser.id);

      expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(repository.delete).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UserNotFoundException when user not exists', async () => {
      const userId = 'non-existent-id';
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(
        UserNotFoundException
      );
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('listUsers', () => {
    it('should return a list of users', async () => {
      const userList = [mockUser, { ...mockUser, id: 'another-id', email: 'outro@exemplo.com' }];
      repository.findAll.mockResolvedValue(userList);

      const result = await service.listUsers();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(userList);
    });

    it('should return an empty list when there are no users', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.listUsers();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
