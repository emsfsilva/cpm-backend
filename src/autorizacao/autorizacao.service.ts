import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { AutorizacaoEntity } from './entities/autorizacao.entity';
import { CreateAutorizacaoDto } from './dtos/create-autorizacao.dto';
import { ReturnAutorizacaoDto } from './dtos/return-autorizacao.dto';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import * as moment from 'moment';
import { DespachoAutorizacaoDto } from './dtos/despacho-autorizacao.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AutorizacaoService {
  constructor(
    @InjectRepository(AutorizacaoEntity)
    private readonly autorizacaoRepository: Repository<AutorizacaoEntity>,

    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Atualiza automaticamente todas as autorizações com dataFinal já expirada
   */
  private async atualizarSituacoesExpiradas(): Promise<void> {
    const hoje = moment().startOf('day');

    const vigentes = await this.autorizacaoRepository.find({
      where: { situacaoAtual: 'Vigente' },
    });

    const expiradas = vigentes.filter((aut) =>
      moment(aut.dataFinal, 'YYYY-MM-DD').isBefore(hoje, 'day'),
    );

    for (const aut of expiradas) {
      aut.situacaoAtual = 'Expirada';
      await this.autorizacaoRepository.save(aut);
    }
  }

  /**
   * Retorna todas as autorizações ativas (não expiradas) de um aluno
   */
  async findByAlunoId(userIdAlAut: number): Promise<ReturnAutorizacaoDto[]> {
    // Atualiza automaticamente as expiradas
    await this.atualizarSituacoesExpiradas();

    // Busca apenas as não expiradas
    const autorizacoes = await this.autorizacaoRepository.find({
      where: { userIdAlAut, situacaoAtual: Not('Expirada') },
      relations: ['useraut', 'useralaut', 'userdespaaut'],
    });

    // Carrega dados do aluno
    for (const aut of autorizacoes) {
      if (aut.userIdAlAut) {
        const aluno = await this.alunoRepository.findOne({
          where: { userId: aut.userIdAlAut },
          relations: ['turma', 'turma.cia', 'responsavel1', 'responsavel2'],
        });
        aut['aluno'] = aluno;
      }
    }

    return autorizacoes.map((aut) => new ReturnAutorizacaoDto(aut));
  }

  /**
   * Cria uma nova autorização
   */
  async create(dto: CreateAutorizacaoDto): Promise<ReturnAutorizacaoDto> {
    const hoje = moment().startOf('day');
    const dataFinal = moment(dto.dataFinal, 'YYYY-MM-DD');

    const autorizacao = this.autorizacaoRepository.create({
      ...dto,
      horaFinal: dto.horaInicio,
      statusAut: 'Pendente',
      situacaoAtual: dataFinal.isSameOrAfter(hoje, 'day')
        ? 'Vigente'
        : 'Expirada',
      userIdDespaAut: null,
      despacho: null,
      datadespacho: null,
    });

    const saved = await this.autorizacaoRepository.save(autorizacao);
    return new ReturnAutorizacaoDto(saved);
  }

  /**
   * Atualiza (despacha) uma autorização
   */
  async despachar(
    id: number,
    dto: DespachoAutorizacaoDto,
  ): Promise<ReturnAutorizacaoDto> {
    const autorizacao = await this.autorizacaoRepository.findOne({
      where: { id },
    });

    if (!autorizacao) {
      throw new NotFoundException('Autorização não encontrada');
    }

    const userDespachante = await this.userRepository.findOne({
      where: { id: dto.userIdDespaAut },
    });

    if (!userDespachante) {
      throw new NotFoundException('Usuário despachante não encontrado');
    }

    // Atualiza os campos principais
    autorizacao.userIdDespaAut = dto.userIdDespaAut;
    autorizacao.despacho = dto.despacho ?? autorizacao.despacho;
    autorizacao.motivoAut = dto.motivoAut ?? autorizacao.motivoAut;

    // Define horaInicio e força horaFinal = horaInicio
    autorizacao.horaInicio = dto.horaInicio ?? autorizacao.horaInicio;
    autorizacao.horaFinal = autorizacao.horaInicio;

    autorizacao.statusAut = dto.statusAut ?? autorizacao.statusAut;
    autorizacao.datadespacho = new Date();

    // Atualiza os dias da semana, se vierem no DTO
    autorizacao.seg = dto.seg ?? autorizacao.seg;
    autorizacao.ter = dto.ter ?? autorizacao.ter;
    autorizacao.qua = dto.qua ?? autorizacao.qua;
    autorizacao.qui = dto.qui ?? autorizacao.qui;
    autorizacao.sex = dto.sex ?? autorizacao.sex;
    autorizacao.sab = dto.sab ?? autorizacao.sab;
    autorizacao.dom = dto.dom ?? autorizacao.dom;

    // Atualiza situacaoAtual conforme dataFinal
    const hoje = new Date();
    const dataFinal = new Date(autorizacao.dataFinal);
    autorizacao.situacaoAtual = dataFinal >= hoje ? 'Vigente' : 'Expirada';

    const updated = await this.autorizacaoRepository.save(autorizacao);
    return new ReturnAutorizacaoDto(updated);
  }

  /**
   * Lista todas as autorizações não expiradas
   */
  async findAll(): Promise<ReturnAutorizacaoDto[]> {
    await this.atualizarSituacoesExpiradas();
    const autorizacoes = await this.autorizacaoRepository.find({
      relations: ['useraut', 'useralaut'],
    });

    for (const aut of autorizacoes) {
      if (aut.userIdAlAut) {
        const aluno = await this.alunoRepository.findOne({
          where: { userId: aut.userIdAlAut },
          relations: ['turma', 'turma.cia', 'responsavel1', 'responsavel2'],
        });

        aut['aluno'] = aluno;
      }
    }

    return autorizacoes.map((aut) => new ReturnAutorizacaoDto(aut));
  }

  /**
   * Busca uma autorização por ID
   */
  async findById(id: number): Promise<ReturnAutorizacaoDto> {
    const entity = await this.autorizacaoRepository.findOne({
      where: { id },
      relations: ['useraut', 'useralaut', 'userdespaaut'],
    });

    if (!entity) {
      throw new NotFoundException('Autorização não encontrada');
    }

    return new ReturnAutorizacaoDto(entity);
  }

  /**
   * Deleta uma autorização
   */
  async delete(id: number): Promise<void> {
    await this.autorizacaoRepository.delete(id);
  }
}
