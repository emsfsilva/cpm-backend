import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { TurmaService } from './turma.service';
import { CreateTurma } from './dtos/create-turma.dto';
import { ReturnTurma } from './dtos/return-turma.dto';
import { TurmaEntity } from './entities/turma.entity';

@Roles(
  UserType.Master,
  UserType.Comando,
  UserType.CmtCa,
  UserType.CmtCia,
  UserType.Adm,
  UserType.Monitor,
  UserType.Aluno,
)
@UsePipes(ValidationPipe)
@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Get()
  async findAllTurmas(): Promise<ReturnTurma[]> {
    return (await this.turmaService.findAllTurmas()).map(
      (turma) => new ReturnTurma(turma),
    );
  }

  @Post()
  async createTurma(@Body() createTurma: CreateTurma): Promise<TurmaEntity> {
    return this.turmaService.createTurma(createTurma);
  }
}
