import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUserDto {
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  cpf: string;

  @IsString()
  password: string;
}
