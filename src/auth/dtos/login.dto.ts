import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  seduc: string;

  @IsString()
  password: string;
}
