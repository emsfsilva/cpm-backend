import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorizacaoEntity } from './entities/autorizacao.entity';
import { AutorizacaoService } from './autorizacao.service';
import { AutorizacaoController } from './autorizacao.controller';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AlunoModule } from 'src/aluno/aluno.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module'; // ✅ Módulo que importa JwtModule

@Module({
  imports: [
    TypeOrmModule.forFeature([AutorizacaoEntity, AlunoEntity, UserEntity]),
    forwardRef(() => AlunoModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  providers: [AutorizacaoService],
  controllers: [AutorizacaoController],
  exports: [AutorizacaoService],
})
export class AutorizacaoModule {}
