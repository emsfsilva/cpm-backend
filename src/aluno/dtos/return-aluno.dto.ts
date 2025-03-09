import { ReturnTurma } from 'src/turma/dtos/return-turma.dto';
import { AlunoEntity } from '../entities/aluno.entity';

export class ReturnAlunoDTO {
  id: number;
  userId: number;
  comport: string;
  resp1: string;
  resp2: string;
  turmaId: number;
  turma?: ReturnTurma;

  constructor(alunoEntity: AlunoEntity) {
    this.id = alunoEntity.id;
    this.userId = alunoEntity.userId;
    this.comport = alunoEntity.comport;
    this.resp1 = alunoEntity.resp1;
    this.resp2 = alunoEntity.resp2;
    this.turmaId = alunoEntity.turmaId;

    this.turma = alunoEntity.turma
      ? new ReturnTurma(alunoEntity.turma)
      : undefined;
  }
}
