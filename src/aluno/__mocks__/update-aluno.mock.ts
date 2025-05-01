import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { UpdateAlunoDTO } from '../dtos/update-aluno.dto';

export const updateAlunoMock: UpdateAlunoDTO = {
  userId: turmaMock.id,
  resp1: 'Luiz Francisco da Silva',
  resp2: 'Renevalda Maria',
  turmaId: turmaMock.id,
};
