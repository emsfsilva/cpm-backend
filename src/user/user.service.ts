import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPasswordHashed, validatePassword } from 'src/utils/password';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AlunoService } from 'src/aluno/aluno.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly alunoService: AlunoService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findUserBySeduc(createUserDto.seduc).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('Esse Login Seduc ja esta Cadastrado');
    }

    const passwordHashed = await createPasswordHashed('atos');

    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: passwordHashed,
    });

    if (newUser.typeUser === 1) {
      const aluno = new AlunoEntity();
      aluno.userId = newUser.id;
      aluno.turmaId = 1;
      aluno.resp1 = null;
      aluno.resp2 = null;
      aluno.grauInicial = 10;
      await this.alunoService.createAlunoFromUser(newUser);
    }

    return newUser;
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['typeUser'],
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');

      const relations: any = {
        addresses: {
          city: {
            state: true,
          },
        },
      };

      if (user.typeUser === 1) {
        relations.aluno = {
          turma: {
            cia: true,
          },
          responsavel1: true,
          responsavel2: true,
        };
      }

      const userWithRelations = await this.userRepository.findOne({
        where: { id: userId },
        relations,
      });

      if (!userWithRelations)
        throw new NotFoundException('Usuário não encontrado');

      if (userWithRelations.typeUser === 1 && userWithRelations.aluno) {
        const grauAtual = await this.alunoService.calcularGrauAtual(
          userWithRelations.id,
        );
        (userWithRelations.aluno as any).grauAtual = grauAtual;
      }

      return userWithRelations;
    } catch (error) {
      console.error('Erro ao buscar usuário com relações:', error);
      throw new BadRequestException('Erro ao buscar usuário');
    }
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.aluno', 'aluno')
      .leftJoinAndSelect('aluno.turma', 'turma')
      .leftJoinAndSelect('turma.cia', 'cia')
      .getMany();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${userId} Id não Encontrado`);
    }

    return user;
  }

  async findUserBySeduc(seduc: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        seduc,
      },
    });

    if (!user) {
      throw new NotFoundException(`Eeduc: ${seduc} Seduc não Encontrado`);
    }

    return user;
  }

  async updateUser(
    userId: number,
    data: Partial<CreateUserDto>,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findUserById(userId);

    // Verifica se o usuário está sendo usado como responsável por algum aluno
    const alunosComEsseResponsavel =
      await this.alunoService.findAlunosPorResponsavel(userId);

    if (alunosComEsseResponsavel.length > 0) {
      throw new BadRequestException(
        'Não é possível excluir esse usuário porque ele é responsável por um ou mais alunos.',
      );
    }

    // Se for aluno, delete o vínculo primeiro
    if (user.typeUser === 1) {
      await this.alunoService.deleteByUserId(userId);
    }

    await this.userRepository.delete(userId);
  }

  async updatePasswordUser(
    updatePasswordDTO: UpdatePasswordDTO,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    const passwordHashed = await createPasswordHashed(
      updatePasswordDTO.newPassword,
    );

    const isMatch = await validatePassword(
      updatePasswordDTO.lastPassword,
      user.password || '',
    );

    if (!isMatch) {
      throw new BadRequestException('Ultima Senha está Incorreta');
    }

    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }

  async resetPassword(userId: number): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD || 'atos';
    const passwordHashed = await createPasswordHashed(defaultPassword);

    user.password = passwordHashed;
    return await this.userRepository.save(user);
  }
}
