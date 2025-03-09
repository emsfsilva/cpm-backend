import { ReturnCia } from 'src/cia/dtos/return-cia.dto';
import { TurmaEntity } from '../entities/turma.entity';

export class ReturnTurma {
  id: number;
  name: string;
  cia?: ReturnCia;

  constructor(turmaEntity: TurmaEntity) {
    this.id = turmaEntity.id;
    this.name = turmaEntity.name;
    this.cia = turmaEntity.cia ? new ReturnCia(turmaEntity.cia) : undefined;
  }
}
