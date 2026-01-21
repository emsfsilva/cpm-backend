import { IsOptional, IsString, IsNumber } from 'class-validator';

export class DespachoAutorizacaoDto {
  @IsNumber()
  userIdDespaAut: number;

  @IsOptional()
  @IsString()
  despacho?: string;

  @IsOptional()
  @IsString()
  motivoAut?: string;

  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  statusAut?: 'Autorizada' | 'Autorizada com restrição' | 'Negada';

  @IsOptional() seg?: string;
  @IsOptional() ter?: string;
  @IsOptional() qua?: string;
  @IsOptional() qui?: string;
  @IsOptional() sex?: string;
  @IsOptional() sab?: string;
  @IsOptional() dom?: string;
}
