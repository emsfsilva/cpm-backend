import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { CreateAlunoDTO } from '../dtos/create-aluno.dto';

export const createAlunoMock: CreateAlunoDTO = {
  userId: turmaMock.id,
  resp1: 'Luiz Francisco da Silva',
  resp2: 'Renevalda Maria',
  grauInicial: 10,
  turmaId: turmaMock.id,
};
