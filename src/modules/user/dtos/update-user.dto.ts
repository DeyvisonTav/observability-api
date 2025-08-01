import { IsEmail, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser um texto' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email único do usuário',
    example: 'joao.silva@exemplo.com',
    format: 'email',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @MaxLength(255, { message: 'Email deve ter no máximo 255 caracteres' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nova senha do usuário (será criptografada)',
    example: 'NovaSenh@456',
    minLength: 6,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Senha deve ser um texto' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  password?: string;
} 