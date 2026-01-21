import { IsNumber } from 'class-validator';

export class UpdateResponsaveisDTO {
  @IsNumber()
  resp1: number; // 0 representa "sem responsável"

  @IsNumber()
  resp2: number;
}
