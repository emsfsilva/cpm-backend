import { Injectable, NotFoundException } from '@nestjs/common';
import { ComunicacaoEntity } from './entities/comunicacao.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComunicacaoDTO } from './dtos/create-comunicacao.dto';
import { ReturnComunicacaoDTO } from './dtos/return-comunicacao.dto';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AlunoService } from 'src/aluno/aluno.service';

import { In } from 'typeorm';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@Injectable()
export class ComunicacaoService {
  constructor(
    @InjectRepository(ComunicacaoEntity)
    private readonly comunicacaoRepository: Repository<ComunicacaoEntity>,

    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    private readonly alunoService: AlunoService,
  ) {}

  // Função para retornar um objeto com contagem por CIA e status
  async contarComunicacoesAgrupadasPorStatusECia(): Promise<
    Record<string, Record<string, number>>
  > {
    const dadosBrutos = await this.contarComunicacoesPorStatusPorCia();

    const resultado: Record<string, Record<string, number>> = {};

    for (const row of dadosBrutos) {
      const { ciaName, status, total } = row;

      // Inicializa a companhia se ainda não existir
      if (!resultado[ciaName]) {
        resultado[ciaName] = {};
      }

      // Inicializa o status se ainda não existir
      if (!resultado[ciaName][status]) {
        resultado[ciaName][status] = 0;
      }

      resultado[ciaName][status] += total;
    }

    return resultado;
  }

  //Excluir Comunicacao
  async excluirComunicacao(comunicacaoId: number): Promise<void> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new NotFoundException(
        `Comunicação com ID ${comunicacaoId} não encontrada.`,
      );
    }

    await this.comunicacaoRepository.remove(comunicacao);
  }

  // Função para buscar todas as comunicações
  async buscarTodasComunicacoes(): Promise<ReturnComunicacaoDTO[]> {
    const comunicacoes = await this.comunicacaoRepository
      .createQueryBuilder('comunicacao')
      .leftJoinAndSelect('comunicacao.useral', 'useral')
      .leftJoinAndSelect('useral.aluno', 'aluno')
      .leftJoinAndSelect('aluno.turma', 'turma')
      .leftJoinAndSelect('turma.cia', 'cia')
      .leftJoinAndSelect('comunicacao.usercom', 'usercom')
      .leftJoinAndSelect('comunicacao.usercmtcia', 'usercmtcia')
      .leftJoinAndSelect('comunicacao.userca', 'userca')
      .leftJoinAndSelect('comunicacao.usersubcom', 'usersubcom')
      .orderBy('comunicacao.dtatualizacaostatus', 'DESC')
      .getMany();

    return comunicacoes.map(
      (comunicacao) => new ReturnComunicacaoDTO(comunicacao),
    );
  }

  // Função para buscar comunicações por id
  async findComunicacaoById(
    comunicacaoId: number,
    userPayload: LoginPayload, // <--- adicionado aqui
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
      relations: {
        useral: {
          aluno: {
            responsavel1: true,
            responsavel2: true,
            turma: {
              cia: true,
            },
          },
        },
        usercom: true,
        usercmtcia: true,
        userca: true,
        usersubcom: true,
        userarquivador: true,
      },
    });

    if (!comunicacao) {
      throw new NotFoundException(
        `Comunicacao id: ${comunicacaoId} Não Encontrado`,
      );
    }

    // Cálculo de grau
    if (comunicacao.useral?.aluno) {
      const grauAtual = await this.alunoService.calcularGrauAtual(
        comunicacao.useral.id,
      );
      (comunicacao.useral.aluno as any).grauAtual = grauAtual;
    }

    // Marcar ciência dos responsáveis
    const userId = userPayload.id;

    const responsavel1Id = comunicacao?.useral?.aluno?.responsavel1?.id;
    const responsavel2Id = comunicacao?.useral?.aluno?.responsavel2?.id;

    let houveAtualizacao = false;

    if (
      responsavel1Id &&
      responsavel1Id === userId &&
      !comunicacao.dataCienciaResponsavel1
    ) {
      comunicacao.dataCienciaResponsavel1 = new Date();
      houveAtualizacao = true;
    }

    if (
      responsavel2Id &&
      responsavel2Id === userId &&
      !comunicacao.dataCienciaResponsavel2
    ) {
      comunicacao.dataCienciaResponsavel2 = new Date();
      houveAtualizacao = true;
    }

    if (houveAtualizacao) {
      await this.comunicacaoRepository.save(comunicacao);
    }

    return new ReturnComunicacaoDTO(comunicacao);
  }

  // Função para buscar comunicações por id do Aluno
  async findComunicacoesByAlunoUserId(
    userIdAl: number,
  ): Promise<ReturnComunicacaoDTO[]> {
    const statusPermitidos = [
      'Aguardando resposta do aluno',
      'Aguardando enviar ao Cmt da Cia',
      'Comunicação arquivada',
      'Aguardando parecer do Cmt da Cia',
      'Aguardando parecer do Cmt do CA',
      'Aguardando parecer do Subcomando',
      'Aguardando publicação',
      'Comunicação publicada',
    ];

    const comunicacoes = await this.comunicacaoRepository.find({
      where: {
        userIdAl,
        status: In(statusPermitidos), // <- agora direto!
      },
      relations: {
        useral: true,
        usercom: true,
        usercmtcia: true,
        userca: true,
        usersubcom: true,
      },
      order: { dataCom: 'DESC' },
    });

    return comunicacoes.map(
      (comunicacao) => new ReturnComunicacaoDTO(comunicacao),
    );
  }

  //inicio Função para contar as comunicações da CIA pelo status
  async contarComunicacoesPorStatusPorCia(): Promise<
    { ciaName: string; status: string; total: number }[]
  > {
    const result = await this.comunicacaoRepository
      .createQueryBuilder('comunicacao')
      .leftJoin('comunicacao.useral', 'useral')
      .leftJoin('useral.aluno', 'aluno')
      .leftJoin('aluno.turma', 'turma')
      .leftJoin('turma.cia', 'cia')
      .select('COALESCE(cia.name, :semCia)', 'ciaName')
      .addSelect('comunicacao.status', 'status')
      .addSelect('COUNT(comunicacao.id)', 'total')
      .groupBy('cia.name')
      .addGroupBy('comunicacao.status')
      .setParameter('semCia', 'Sem CIA')
      .getRawMany();

    return result.map((row) => ({
      ciaName: row.ciaName,
      status: row.status,
      total: Number(row.total),
    }));
  }

  //inicio Função para contar as comunicações APENAS por CIA
  async contarComunicacoesPorCia(): Promise<
    { ciaName: string; total: number }[]
  > {
    const result = await this.comunicacaoRepository
      .createQueryBuilder('comunicacao')
      .leftJoin('comunicacao.useral', 'useral')
      .leftJoin('useral.aluno', 'aluno')
      .leftJoin('aluno.turma', 'turma')
      .leftJoin('turma.cia', 'cia')
      .select('COALESCE(cia.name, :semCia)', 'ciaName')
      .addSelect('COUNT(comunicacao.id)', 'total')
      .groupBy('cia.name')
      .setParameter('semCia', 'Sem CIA')
      .getRawMany();

    return result.map((row) => ({
      ciaName: row.ciaName,
      total: Number(row.total),
    }));
  }

  // Função para criar uma comunicação inicial
  async criarComunicacao(
    createComunicacaoDTO: CreateComunicacaoDTO,
    userIdCom: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = new ComunicacaoEntity();
    comunicacao.userIdCom = userIdCom;
    comunicacao.motivo = createComunicacaoDTO.motivo;
    comunicacao.grauMotivo = null;
    comunicacao.enquadramento = null;
    comunicacao.descricaoMotivo = createComunicacaoDTO.descricaoMotivo;
    comunicacao.dataInicio = createComunicacaoDTO.dataInicio;
    comunicacao.horaInicio = createComunicacaoDTO.horaInicio;
    comunicacao.natureza = null;
    comunicacao.dataCom = new Date();
    comunicacao.userIdAl = createComunicacaoDTO.userIdAl;
    comunicacao.resposta = null;
    comunicacao.dataResp = null;
    comunicacao.userIdCmtCia = null;
    comunicacao.parecerCmtCia = null;
    comunicacao.dataParecerCmtCia = null;

    comunicacao.userIdCa = null;
    comunicacao.parecerCa = null;
    comunicacao.dataParecerCa = null;

    comunicacao.userIdSubcom = null;
    comunicacao.parecerSubcom = null;
    comunicacao.dataParecerSubcom = null;

    comunicacao.status = 'Aguardando notificar aluno';
    comunicacao.dtAtualizacaoStatus = new Date();

    const savedComunicacao = await this.comunicacaoRepository.save(comunicacao);
    return new ReturnComunicacaoDTO(savedComunicacao);
  }

  //Função Enquadramento serve para atualuzar o grauMotivo e notificar o aluno a responder a comunicacao
  async atualizarStatusParaAguardandoRespostaDoAluno(
    comunicacaoId: number,
    grauMotivo: number,
    enquadramento: string,
    natureza: string,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });
    if (!comunicacao) {
      throw new NotFoundException('Comunicação não encontrada');
    }
    comunicacao.grauMotivo = grauMotivo;
    comunicacao.status = 'Aguardando resposta do aluno';
    comunicacao.enquadramento = enquadramento;
    comunicacao.natureza = natureza;
    comunicacao.dtAtualizacaoStatus = new Date();
    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para o aluno responder à comunicação
  async responderComunicacao(
    comunicacaoId: number,
    resposta: string,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.resposta = resposta;
    comunicacao.dataResp = new Date();
    comunicacao.status = 'Aguardando enviar ao Cmt da Cia';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  //Função para enviar ao cmt da cia
  async atualizarStatusParaEnviarAoCmtdaCia(
    comunicacaoId: number,
  ): Promise<ReturnComunicacaoDTO> {
    console.log('Recebendo PUT para comunicação ID:', comunicacaoId);

    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new NotFoundException('Comunicação não encontrada');
    }

    comunicacao.status = 'Aguardando parecer do Cmt da Cia';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para adicionar o parecer do Cmt da Cia
  async adicionarParecerCmtCia(
    comunicacaoId: number,
    parecerCmtCia: string,
    userIdCmtCia: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.parecerCmtCia = parecerCmtCia;
    comunicacao.userIdCmtCia = userIdCmtCia;
    comunicacao.dataParecerCmtCia = new Date();
    comunicacao.status = 'Aguardando parecer do Cmt do CA';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para adicionar o parecer do Cmt da CA
  async adicionarParecerCa(
    comunicacaoId: number,
    parecerCa: string,
    userIdCa: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.parecerCa = parecerCa;
    comunicacao.userIdCa = userIdCa;
    comunicacao.dataParecerCa = new Date();
    comunicacao.status = 'Aguardando parecer do Subcomando';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Função para adicionar o parecer do Subcomando
  async adicionarParecerSubcom(
    comunicacaoId: number,
    parecerSubcom: string,
    userIdSubcom: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    comunicacao.parecerSubcom = parecerSubcom;
    comunicacao.userIdSubcom = userIdSubcom;
    comunicacao.dataParecerSubcom = new Date();
    comunicacao.status = 'Aguardando publicação';
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }

  // Inicio Função para publicar a comunicação
  async publicarComunicacao(
    comunicacaoId: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new Error('Comunicação não encontrada');
    }

    // Atualizando o status para "Comunicacao Publicada"
    comunicacao.status = 'Comunicação publicada';

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );

    // Buscando o aluno
    const aluno = await this.alunoRepository.findOne({
      where: { userId: comunicacao.userIdAl },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    return new ReturnComunicacaoDTO(updatedComunicacao);
  }
  // Fim Função para publicar a comunicação

  // Inicio Função para Arquivar a comunicação
  async arquivarComunicacao(
    comunicacaoId: number,
    motivoArquivamento: string,
    userIdArquivamento: number,
  ): Promise<ReturnComunicacaoDTO> {
    const comunicacao = await this.comunicacaoRepository.findOne({
      where: { id: comunicacaoId },
    });

    if (!comunicacao) {
      throw new NotFoundException('Comunicação não encontrada');
    }

    comunicacao.status = 'Comunicação arquivada';
    comunicacao.motivoArquivamento = motivoArquivamento;
    comunicacao.userIdArquivamento = userIdArquivamento;
    comunicacao.dtAtualizacaoStatus = new Date();

    const updatedComunicacao = await this.comunicacaoRepository.save(
      comunicacao,
    );
    return new ReturnComunicacaoDTO(updatedComunicacao);
  }
  // Fim Função para Arquivar a comunicação
}
