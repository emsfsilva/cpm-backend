import { IsString, IsEnum, IsNumber } from 'class-validator';
import { UserType } from '../enum/user-type.enum'; // Importe o enum UserType

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  cpf: string;

  @IsString()
  orgao: string;

  @IsString()
  pg: string;

  @IsNumber()
  mat: number;

  @IsString()
  nomeGuerra: string;

  @IsString()
  funcao: string;

  @IsString()
  password: string;

  @IsEnum(UserType) // Adiciona validação para garantir que o tipo seja válido
  typeUser: UserType; // Agora o DTO tem o campo typeUser
}
