import { IsNumber, IsString } from 'class-validator';

export class CreateAlunoDTO {
  @IsNumber()
  userId: number;

  @IsString()
  resp1: string;

  @IsString()
  resp2: string;

  @IsNumber()
  grauInicial: number;

  @IsNumber()
  turmaId: number;
}
