import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressModule } from './address/address.module';
import { CacheCustomModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { CiaModule } from './cia/cia.module';
import { TurmaModule } from './turma/turma.module';
import { AlunoModule } from './aluno/aluno.module';
import { ComunicacaoModule } from './comunicacao/comunicacao.module';
import { AutorizacaoModule } from './autorizacao/autorizacao.module';
import { ComentarioModule } from './comentario/comentario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        migrations: [`${__dirname}/migration/{.ts,*.js}`],
        migrationsRun: true,
      }),
    }),

    UserModule,
    StateModule,
    CityModule,
    AddressModule,
    CacheCustomModule,
    AuthModule,
    JwtModule,
    CiaModule,
    TurmaModule,
    AlunoModule,
    ComunicacaoModule,
    AutorizacaoModule,
    ComentarioModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
