import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dtos/create-comentario.dto';
import { ComentarioEntity } from './entities/comentario.entity';

@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}

  @Post()
  async create(@Body() dto: CreateComentarioDto): Promise<ComentarioEntity> {
    return this.comentarioService.create(dto);
  }

  @Get()
  async findAtual(): Promise<ComentarioEntity | null> {
    return this.comentarioService.findAtual();
  }
}
