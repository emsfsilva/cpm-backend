import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorizacaoEntity } from './entities/autorizacao.entity';
import { AutorizacaoService } from './autorizacao.service';
import { AutorizacaoController } from './autorizacao.controller';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AlunoModule } from 'src/aluno/aluno.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutorizacaoEntity,
      AlunoEntity, // ✅ Adicione isso aqui
      UserEntity, // ✅ E isso também
    ]),
    forwardRef(() => AlunoModule), // ✅ Isso garante que os serviços do módulo Aluno estejam acessíveis
    forwardRef(() => UserModule), // ✅ Para garantir acesso ao UserService (se usado)
  ],
  providers: [AutorizacaoService],
  controllers: [AutorizacaoController],
  exports: [AutorizacaoService],
})
export class AutorizacaoModule {}
