import { IsNumber } from 'class-validator';

export class UpdateAlunoDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  turmaId: number;
}
