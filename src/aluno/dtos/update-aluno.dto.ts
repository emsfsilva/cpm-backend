import { IsNumber, IsString } from 'class-validator';

export class UpdateAlunoDTO {
  @IsNumber()
  userId: number;

  @IsString()
  resp1: string;

  @IsString()
  resp2: string;

  @IsNumber()
  turmaId: number;
}
