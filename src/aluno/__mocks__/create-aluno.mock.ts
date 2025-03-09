import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { CreateAlunoDTO } from '../dtos/create-aluno.dto';

export const createAlunoMock: CreateAlunoDTO = {
  userId: turmaMock.id,
  comport: '10.0',
  resp1: 'Luiz Francisco da Silva',
  resp2: 'Renevalda Maria',
  turmaId: turmaMock.id,
};
