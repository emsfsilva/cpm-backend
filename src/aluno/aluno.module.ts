import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoEntity } from './entities/aluno.entity';
import { TurmaModule } from '../turma/turma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AlunoEntity]), UserModule, TurmaModule],
  providers: [AlunoService],
  controllers: [AlunoController],
})
export class AlunoModule {}
