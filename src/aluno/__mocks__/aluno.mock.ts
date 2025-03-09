import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { AlunoEntity } from '../entities/aluno.entity';

export const alunoMock: AlunoEntity = {
  id: 7435,
  userId: 1,
  comport: '10.0',
  resp1: 'Luiz Francisco da Silva',
  resp2: 'Renevalda Maria',
  turmaId: turmaMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
