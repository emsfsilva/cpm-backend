import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CreateAlunoDTO } from './dtos/create-aluno.dto';
import { ReturnAlunoDTO } from './dtos/return-aluno.dto';
import { UpdateAlunoDTO } from './dtos/update-aluno.dto';
import { AlunoEntity } from './entities/aluno.entity';
import { AlunoService } from './aluno.service';

@Controller('aluno')
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
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Get()
  async findAll(): Promise<ReturnAlunoDTO[]> {
    return (await this.alunoService.findAll()).map(
      (aluno) => new ReturnAlunoDTO(aluno),
    );
  }

  @Post()
  async createAluno(@Body() createAluno: CreateAlunoDTO): Promise<AlunoEntity> {
    return this.alunoService.createAluno(createAluno);
  }

  @Delete('/:alunoId')
  async deleteAluno(@Param('alunoId') alunoId: number): Promise<DeleteResult> {
    return this.alunoService.deleteAluno(alunoId);
  }

  @Put('/:alunoId')
  async updateAluno(
    @Body() updateAluno: UpdateAlunoDTO,
    @Param('alunoId') alunoId: number,
  ): Promise<AlunoEntity> {
    return this.alunoService.updateAluno(updateAluno, alunoId);
  }
}
