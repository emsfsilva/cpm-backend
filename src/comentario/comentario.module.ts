import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioService } from './comentario.service';
import { ComentarioController } from './comentario.controller';
import { ComentarioEntity } from './entities/comentario.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComentarioEntity, UserEntity]), // ✅ Importando entidades
  ],
  providers: [ComentarioService],
  controllers: [ComentarioController],
  exports: [ComentarioService], // opcional (caso queira usar em outros módulos)
})
export class ComentarioModule {}
