import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { CiaEntity } from 'src/cia/entities/cia.entity';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';
import { AlunoModule } from 'src/aluno/aluno.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CiaEntity, ComunicacaoEntity]),
    forwardRef(() => AlunoModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
