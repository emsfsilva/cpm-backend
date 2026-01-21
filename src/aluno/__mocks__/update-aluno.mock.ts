import { turmaMock } from '../../turma/__mocks__/turma.mock';
import { UpdateAlunoDTO } from '../dtos/update-aluno.dto';

export const updateAlunoMock: UpdateAlunoDTO = {
  userId: turmaMock.id,
  turmaId: turmaMock.id,
};
