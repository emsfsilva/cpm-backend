import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { UpdateAlunoDTO } from '../dtos/update-aluno.dto';

export const updateAlunoMock: UpdateAlunoDTO = {
  userId: turmaMock.id,
  comport: '10.0',
  resp1: 'Luiz Francisco da Silva',
  resp2: 'Renevalda Maria',
  turmaId: turmaMock.id,
};
