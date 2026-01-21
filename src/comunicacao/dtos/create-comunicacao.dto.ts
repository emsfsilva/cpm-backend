import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateComunicacaoDTO {
  @IsNotEmpty()
  @IsNumber()
  userIdAl: number;

  userIdCom: number;

  @IsNotEmpty()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsNumber()
  grauMotivo: number;

  @IsNotEmpty()
  @IsString()
  descricaoMotivo: string;

  @IsNotEmpty()
  @IsDateString()
  dataInicio: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 5)
  horaInicio: string;

  @IsString()
  natureza: string;

  @IsString()
  enquadramento: string;

  // A data será gerenciada diretamente no service, então ela pode ser opcional aqui
  @IsOptional()
  dataCom?: Date;
}
