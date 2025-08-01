import { Controller, Post, Body, Get, Param, Put, Delete, UseInterceptors, HttpStatus } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserResponseDto } from "../dtos/user-response.dto";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";

@ApiTags('users')
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuário',
    description: 'Cria um novo usuário com nome, email e senha. O email deve ser único.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiConflictResponse({ description: 'Email já existe' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const createdUser = await this.userService.createUser(createUserDto);
    return plainToInstance(UserResponseDto, createdUser);
  }

  @Get(":id")
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico pelo seu ID.',
  })
  @ApiParam({ name: 'id', description: 'ID único do usuário', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async getUserById(@Param("id") id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    return plainToInstance(UserResponseDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista com todos os usuários cadastrados.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários',
    type: [UserResponseDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async listUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.listUsers();
    return users.map(user => plainToInstance(UserResponseDto, user));
  }

  @Put(":id")
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente. Todos os campos são opcionais.',
  })
  @ApiParam({ name: 'id', description: 'ID único do usuário', type: 'string' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiConflictResponse({ description: 'Email já existe' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return plainToInstance(UserResponseDto, updatedUser);
  }

  @Delete(":id")
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove um usuário do sistema permanentemente.',
  })
  @ApiParam({ name: 'id', description: 'ID único do usuário', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuário removido com sucesso' }
      }
    },
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async deleteUser(@Param("id") id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: 'Usuário removido com sucesso' };
  }

  @Get("email/:email")
  @ApiOperation({
    summary: 'Buscar usuário por email',
    description: 'Retorna os dados de um usuário específico pelo seu email.',
  })
  @ApiParam({ name: 'email', description: 'Email do usuário', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado ou null se não existir',
    type: UserResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async getUserByEmail(@Param("email") email: string): Promise<UserResponseDto | null> {
    const user = await this.userService.getUserByEmail(email);
    return user ? plainToInstance(UserResponseDto, user) : null;
  }
}