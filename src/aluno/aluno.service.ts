import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurmaService } from '../turma/turma.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAlunoDTO } from './dtos/create-aluno.dto';
import { AlunoEntity } from './entities/aluno.entity';
import { UpdateAlunoDTO } from './dtos/update-aluno.dto';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    private readonly turmaService: TurmaService,
  ) {}

  async findAll(): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find();

    if (!alunos || alunos.length === 0) {
      throw new NotFoundException('Nenhum Aluno Encontrado');
    }

    return alunos;
  }

  async createAluno(createAluno: CreateAlunoDTO): Promise<AlunoEntity> {
    await this.turmaService.findTurmaById(createAluno.turmaId);

    return this.alunoRepository.save({
      ...createAluno,
    });
  }

  async findAlunoById(alunoId: number): Promise<AlunoEntity> {
    const aluno = await this.alunoRepository.findOne({
      where: {
        id: alunoId,
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno id: ${alunoId} Não Eontrado`);
    }

    return aluno;
  }

  async deleteAluno(alunoId: number): Promise<DeleteResult> {
    await this.findAlunoById(alunoId);

    return this.alunoRepository.delete({ id: alunoId });
  }

  async updateAluno(
    updateAluno: UpdateAlunoDTO,
    alunoId: number,
  ): Promise<AlunoEntity> {
    const aluno = await this.findAlunoById(alunoId);

    return this.alunoRepository.save({
      ...aluno,
      ...updateAluno,
    });
  }
}
