import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComentarioEntity } from './entities/comentario.entity';
import { CreateComentarioDto } from './dtos/create-comentario.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserType } from 'src/user/enum/user-type.enum';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(ComentarioEntity)
    private readonly comentarioRepository: Repository<ComentarioEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateComentarioDto): Promise<ComentarioEntity> {
    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: dto.userIdComentario },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Permitir apenas tipos 6, 7, 8 e 10
    const tiposPermitidos = [
      UserType.CmtCia,
      UserType.CmtCa,
      UserType.Comando,
      UserType.Master,
    ];
    if (!tiposPermitidos.includes(user.typeUser)) {
      throw new ForbiddenException(
        'Usuário não possui permissão para comentar',
      );
    }

    // 🔹 Busca o comentário existente (se houver)
    const comentarioExistente = (
      await this.comentarioRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      })
    )[0];

    // 🔹 Atualiza o existente
    if (comentarioExistente) {
      comentarioExistente.userIdComentario = dto.userIdComentario;
      comentarioExistente.comentario = dto.comentario;
      return await this.comentarioRepository.save(comentarioExistente);
    }

    // 🔹 Se não existir, cria um novo
    const novoComentario = this.comentarioRepository.create({
      userIdComentario: dto.userIdComentario,
      comentario: dto.comentario,
    });

    return await this.comentarioRepository.save(novoComentario);
  }

  // 🔹 Retorna o comentário atual (apenas 1)
  async findAtual(): Promise<ComentarioEntity | null> {
    const comentario = (
      await this.comentarioRepository.find({
        relations: ['usercomentario'],
        order: { createdAt: 'DESC' },
        take: 1,
      })
    )[0];
    return comentario || null;
  }
}
