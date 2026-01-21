import { AutorizacaoEntity } from '../entities/autorizacao.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';

export class ReturnAutorizacaoDto {
  id: number;
  userIdAut: number;
  userIdAlAut: number;
  motivoAut: string;
  dataInicio: string;
  dataFinal: string;
  horaInicio: string;
  horaFinal: string;
  seg: string;
  ter: string;
  qua: string;
  qui: string;
  sex: string;
  sab: string;
  dom: string;
  userIdDespaAut: number;
  despacho: string;
  datadespacho: Date;
  statusAut: string;
  obsAut: string;
  situacaoAtual: string;
  createdAt: Date;
  updatedAt: Date;

  useraut?: Partial<UserEntity>;
  useralaut?: Partial<UserEntity>;
  userdespaaut?: Partial<UserEntity>;

  alunoInfo?: {
    turma?: { id: number; name: string };
    cia?: { id: number; name: string };
    responsavel1?: Partial<UserEntity>;
    responsavel2?: Partial<UserEntity>;
  };

  constructor(entity: AutorizacaoEntity & { aluno?: AlunoEntity }) {
    this.id = entity.id;
    this.userIdAut = entity.userIdAut;
    this.userIdAlAut = entity.userIdAlAut;
    this.motivoAut = entity.motivoAut;
    this.dataInicio = entity.dataInicio;
    this.dataFinal = entity.dataFinal;
    this.horaInicio = entity.horaInicio;
    this.horaFinal = entity.horaFinal;
    this.seg = entity.seg;
    this.ter = entity.ter;
    this.qua = entity.qua;
    this.qui = entity.qui;
    this.sex = entity.sex;
    this.sab = entity.sab;
    this.dom = entity.dom;
    this.userIdDespaAut = entity.userIdDespaAut;
    this.despacho = entity.despacho;
    this.datadespacho = entity.datadespacho;
    this.statusAut = entity.statusAut;
    this.obsAut = entity.obsAut;
    this.situacaoAtual = entity.situacaoAtual;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;

    this.useraut = entity.useraut
      ? {
          id: entity.useraut.id,
          pg: entity.useraut.pg,
          name: entity.useraut.name,
          nomeGuerra: entity.useraut.nomeGuerra,
          funcao: entity.useraut.funcao,
          imagemPerfil: entity.useraut.imagemPerfil,
        }
      : undefined;

    this.useralaut = entity.useralaut
      ? {
          id: entity.useralaut.id,
          pg: entity.useralaut.pg,
          name: entity.useralaut.name,
          nomeGuerra: entity.useralaut.nomeGuerra,
          funcao: entity.useralaut.funcao,
          imagemPerfil: entity.useralaut.imagemPerfil,
        }
      : undefined;

    this.userdespaaut = entity.userdespaaut
      ? {
          id: entity.userdespaaut.id,
          pg: entity.userdespaaut.pg,
          name: entity.userdespaaut.name,
          nomeGuerra: entity.userdespaaut.nomeGuerra,
          funcao: entity.userdespaaut.funcao,
          imagemPerfil: entity.userdespaaut.imagemPerfil,
        }
      : undefined;

    if (entity.aluno) {
      this.alunoInfo = {
        turma: entity.aluno.turma
          ? { id: entity.aluno.turma.id, name: entity.aluno.turma.name }
          : undefined,
        cia: entity.aluno.turma?.cia
          ? { id: entity.aluno.turma.cia.id, name: entity.aluno.turma.cia.name }
          : undefined,
        responsavel1: entity.aluno.responsavel1
          ? {
              id: entity.aluno.responsavel1.id,
              pg: entity.aluno.responsavel1.pg,
              name: entity.aluno.responsavel1.name,
              nomeGuerra: entity.aluno.responsavel1.nomeGuerra,
              funcao: entity.aluno.responsavel1.funcao,
            }
          : undefined,
        responsavel2: entity.aluno.responsavel2
          ? {
              id: entity.aluno.responsavel2.id,
              pg: entity.aluno.responsavel2.pg,
              name: entity.aluno.responsavel2.name,
              nomeGuerra: entity.aluno.responsavel2.nomeGuerra,
              funcao: entity.aluno.responsavel2.funcao,
            }
          : undefined,
      };
    }
  }
}
