import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurmaService } from '../turma/turma.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAlunoDTO } from './dtos/create-aluno.dto';
import { AlunoEntity } from './entities/aluno.entity';
import { UpdateAlunoDTO } from './dtos/update-aluno.dto';
import { ReturnAlunoDTO } from './dtos/return-aluno.dto';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    @InjectRepository(ComunicacaoEntity)
    private readonly comunicacaoRepository: Repository<ComunicacaoEntity>,

    private readonly turmaService: TurmaService,
  ) {}

  //Metodo para calcular o grau do Aluno em tempo REAL
  async calcularGrauAtual(userIdAl: number): Promise<number> {
    const aluno = await this.alunoRepository.findOne({
      where: { userId: userIdAl },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const resultado = await this.comunicacaoRepository
      .createQueryBuilder('comunicacao')
      .select('SUM(comunicacao.grauMotivo)', 'soma')
      .where('comunicacao.userIdAl = :userIdAl', { userIdAl })
      //andWhere: adiciona mais condições (como se fosse AND no SQL)
      .andWhere('comunicacao.status = :status', {
        status: 'Comunicação publicada',
      })
      .getRawOne();

    const somaGrauMotivo = parseFloat(resultado.soma) || 0;

    return aluno.grauInicial - somaGrauMotivo;
  }

  async findAll(): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find({
      relations: {
        user: true,
        turma: {
          cia: true, // Carregar apenas a propriedade 'cia' da relação turma
        },
      },
    });

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

  async findAlunoById(alunoId: number): Promise<ReturnAlunoDTO> {
    const aluno = await this.alunoRepository.findOne({
      where: {
        id: alunoId,
      },
      relations: {
        user: true,
        turma: {
          cia: true, // Carregar apenas a propriedade 'cia' da relação turma
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno id: ${alunoId} Não Encontrado`);
    }

    const grauAtual = await this.calcularGrauAtual(aluno.userId);

    return new ReturnAlunoDTO(aluno, grauAtual);
  }

  async findAlunoByUserId(userId: number): Promise<ReturnAlunoDTO> {
    const aluno = await this.alunoRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        turma: {
          cia: true,
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com userId: ${userId} não encontrado`);
    }

    const grauAtual = await this.calcularGrauAtual(userId);

    return new ReturnAlunoDTO(aluno, grauAtual);
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
