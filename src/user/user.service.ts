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
import { AdmEntity } from 'src/adm/entities/adm.entity';
import { CaEntity } from 'src/ca/entities/ca.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    // Injeção do repositório de Aluno
    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    @InjectRepository(CaEntity)
    private readonly caRepository: Repository<CaEntity>,

    // Injeção do repositório de Aluno
    @InjectRepository(AdmEntity)
    private readonly admRepository: Repository<AdmEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDto.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('Esse E-mail ja esta Cadastrado');
    }
    const passwordHashed = await createPasswordHashed(createUserDto.password);

    // Criação do usuário
    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: passwordHashed,
    });

    // Se o tipo de usuário for "Aluno" (tipo 1), cria-se o registro na tabela "Aluno"
    if (newUser.typeUser === 1) {
      const aluno = new AlunoEntity();
      aluno.userId = newUser.id; // Associa o ID do usuário
      aluno.turmaId = 1; // Sem Turma
      aluno.comport = '10'; // Grau Inicial
      aluno.resp1 = 'Não Informado'; // Informar o Resposavel apos o cadastro
      aluno.resp2 = 'Não Informado'; // Informar o Resposavel apos o cadastro

      await this.alunoRepository.save(aluno); // Salva o aluno na tabela
    }

    //Se o tipo de usuário for "Admin" (tipo 4), cria-se o registro na tabela "Admin"
    if (newUser.typeUser === 5) {
      const adm = new AdmEntity();
      adm.userId = newUser.id; // Associa o ID do usuário ao admin
      adm.ciaId = 1; // Sem Cia

      await this.admRepository.save(adm); // Salva o admin na tabela
    }

    if (newUser.typeUser === 6) {
      const ca = new CaEntity();
      ca.userId = newUser.id; // Associa o ID do usuário ao cmt da cia
      await this.caRepository.save(ca); // Salva o cmt da cia na tabela
    }

    return newUser;
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    // Obtenha o usuário para verificar o tipo
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['typeUser'], // Seleciona apenas o atributo type_user
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Define as relações padrão (address é comum para todos)
    const relations: any = {};
    //relations['addresses.city.state'] = true;

    // Verifica o tipo de usuário e ajusta as relações
    switch (user.typeUser) {
      case 1: // Aluno
        relations['addresses.city.state'] = true; // Aqui estamos trazendo o endereço (com city e state)
        relations['aluno.turma.cia'] = {
          turma: {
            cia: true, // Aqui estamos trazendo a relação da turma e cia
          },
        };
        break;

      case 2: // Responsavel
        relations['resp'] = true;
        break;

      case 3: // Monitor
        relations['monitor'] = true;
        break;

      case 4: // Civis
        relations['civil'] = true;
        break;

      case 5: // Adm
        relations['adm.cia'] = {
          cia: true,
        };
        break;

      case 6: // Cmt da Cia
        relations['cmtcia'] = true;
        break;

      case 7: // Cmt da Cia
        relations['ca'] = true;
        break;

      case 8: // Comando
        relations['comando'] = true;
        break;

      default:
        throw new Error('Tipo de usuário desconhecido');
    }

    // Realiza a busca com as relações dinâmicas
    return this.userRepository.findOne({
      where: {
        id: userId,
      },

      relations: Object.keys(relations), // Passando as relações para a consulta
      //relations: relations,
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
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

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} Email não Encontrado`);
    }

    return user;
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
      throw new BadRequestException('Last password invalid');
    }

    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
