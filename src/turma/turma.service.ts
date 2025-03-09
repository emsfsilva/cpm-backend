import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTurma } from './dtos/create-turma.dto';
import { TurmaEntity } from './entities/turma.entity';

@Injectable()
export class TurmaService {
  constructor(
    @InjectRepository(TurmaEntity)
    private readonly turmaRepository: Repository<TurmaEntity>,
  ) {}

  async findAllTurmas(): Promise<TurmaEntity[]> {
    const turmas = await this.turmaRepository.find({
      relations: {
        cia: true,
      },
    });

    if (!turmas || turmas.length === 0) {
      throw new NotFoundException('Turma Vazia');
    }

    return turmas;
  }

  async findTurmaById(turmaId: number): Promise<TurmaEntity> {
    const turma = await this.turmaRepository.findOne({
      where: {
        id: turmaId,
      },
    });

    if (!turma) {
      throw new NotFoundException(`Turma id: ${turmaId} não encontrada`);
    }

    return turma;
  }

  async findTurmaByName(name: string): Promise<TurmaEntity> {
    const turma = await this.turmaRepository.findOne({
      where: {
        name,
      },
    });

    if (!turma) {
      throw new NotFoundException(`Turma Nome ${name} não encotrado`);
    }

    return turma;
  }

  async createTurma(createTurma: CreateTurma): Promise<TurmaEntity> {
    const turma = await this.findTurmaByName(createTurma.name).catch(
      () => undefined,
    );

    if (turma) {
      throw new BadRequestException(`Turma name ${createTurma.name} exist`);
    }

    return this.turmaRepository.save(createTurma);
  }
}
