import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurmaService } from '../turma/turma.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAlunoDTO } from './dtos/create-aluno.dto';
import { AlunoEntity } from './entities/aluno.entity';
import { UpdateAlunoDTO } from './dtos/update-aluno.dto';
import { ReturnAlunoDTO } from './dtos/return-aluno.dto';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';
import { UpdateResponsaveisDTO } from './dtos/update-responsaveis.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { BadRequestException } from '@nestjs/common'; // Já deve estar importado
import { AlunoTurmaTotalDTO } from './dtos/alunoturma-total.dto';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    @InjectRepository(ComunicacaoEntity)
    private readonly comunicacaoRepository: Repository<ComunicacaoEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

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

    // Data limite: 1 ano atrás da data atual
    const dataLimite = new Date();
    dataLimite.setFullYear(dataLimite.getFullYear() - 1);

    // Buscar todas as comunicações publicadas e ainda "válidas" (menos de 1 ano)
    const comunicacoesValidas = await this.comunicacaoRepository
      .createQueryBuilder('comunicacao')
      .where('comunicacao.userIdAl = :userIdAl', { userIdAl })
      .andWhere('comunicacao.status = :status', {
        status: 'Comunicação publicada',
      })
      .andWhere('comunicacao.dataCom >= :dataLimite', { dataLimite })
      .getMany();

    // Somar apenas os graus das comunicações ainda dentro do período válido
    const somaGrauMotivo = comunicacoesValidas.reduce(
      (total, c) => total + (c.grauMotivo || 0),
      0,
    );

    // Retornar grau inicial - somatório válido
    return aluno.grauInicial - somaGrauMotivo;
  }

  async findAll(): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find({
      relations: {
        user: true,
        turma: {
          cia: true,
        },
        responsavel1: true,
        responsavel2: true,
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
          cia: true,
        },
        responsavel1: true,
        responsavel2: true,
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
        responsavel1: true,
        responsavel2: true,
      },
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno com userId: ${userId} não encontrado`);
    }

    const grauAtual = await this.calcularGrauAtual(userId);

    return new ReturnAlunoDTO(aluno, grauAtual);
  }

  async findAlunosPorResponsavel(respId: number): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find({
      where: [{ resp1: respId }, { resp2: respId }],
      relations: {
        user: true,
        turma: {
          cia: true,
        },
        responsavel1: true,
        responsavel2: true,
      },
    });

    if (!alunos || alunos.length === 0) {
      throw new NotFoundException(
        'Nenhum aluno encontrado para este responsável',
      );
    }

    return alunos;
  }

  async deleteAluno(alunoId: number): Promise<DeleteResult> {
    await this.findAlunoById(alunoId);

    return this.alunoRepository.delete({ id: alunoId });
  }

  async updateAluno(
    updateAluno: UpdateAlunoDTO,
    alunoId: number,
  ): Promise<AlunoEntity> {
    const alunoExistente = await this.findAlunoById(alunoId);

    const turma = await this.turmaService.findTurmaById(updateAluno.turmaId);

    return this.alunoRepository.save({
      ...alunoExistente,
      userId: updateAluno.userId,
      turma,
    });
  }

  async findAlunosSemTurma(): Promise<AlunoEntity[]> {
    const alunos = await this.alunoRepository.find({
      where: {
        turmaId: 1,
      },
      relations: {
        user: true,
      },
    });

    if (!alunos || alunos.length === 0) {
      throw new NotFoundException('Nenhum aluno disponível sem turma');
    }

    return alunos;
  }

  async updateResponsaveis(
    alunoId: number,
    { resp1, resp2 }: UpdateResponsaveisDTO,
  ): Promise<AlunoEntity> {
    const aluno = await this.alunoRepository.findOne({
      where: { id: alunoId },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    // Se resp1 for diferente de 0, busca o usuário. Se for 0, interpreta como "sem responsável"
    const resp1User =
      resp1 !== 0
        ? await this.userRepository.findOne({ where: { id: resp1 } })
        : null;

    const resp2User =
      resp2 !== 0
        ? await this.userRepository.findOne({ where: { id: resp2 } })
        : null;

    // Valida somente se o ID é diferente de 0 e o usuário não foi encontrado
    if ((resp1 !== 0 && !resp1User) || (resp2 !== 0 && !resp2User)) {
      throw new BadRequestException('Responsável 1 ou 2 inválido');
    }

    // Atualiza os responsáveis (0 = remove, salva como null)
    aluno.resp1 = resp1 !== 0 ? resp1 : null;
    aluno.resp2 = resp2 !== 0 ? resp2 : null;

    return this.alunoRepository.save(aluno);
  }

  async getAlunoTurmaTotais(): Promise<AlunoTurmaTotalDTO> {
    const totalTurmas = await this.turmaService.countTurmas();
    const totalAlunos = await this.alunoRepository.count();
    const totalAlunosSemTurma = await this.alunoRepository.count({
      where: {
        turmaId: null,
      },
    });

    console.log({
      totalTurmas,
      totalAlunos,
      totalAlunosSemTurma,
    });

    return new AlunoTurmaTotalDTO(
      totalTurmas,
      totalAlunos,
      totalAlunosSemTurma,
    );
  }

  async createAlunoFromUser(user: UserEntity): Promise<AlunoEntity> {
    const aluno = this.alunoRepository.create({
      userId: user.id,
      turmaId: 1,
      resp1: null,
      resp2: null,
      grauInicial: 10,
    });

    return this.alunoRepository.save(aluno);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.alunoRepository.delete({ userId });
  }
}
