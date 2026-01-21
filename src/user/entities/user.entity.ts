import { AddressEntity } from '../../address/entities/address.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/user-type.enum';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';
import { AutorizacaoEntity } from 'src/autorizacao/entities/autorizacao.entity';
import { ComentarioEntity } from 'src/comentario/entities/comentario.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'imagem_url', nullable: true })
  imagemUrl: string;

  @Column({ name: 'imagem_perfil', nullable: true })
  imagemPerfil: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'seduc', nullable: false })
  seduc: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'cpf', nullable: false })
  cpf: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'orgao', nullable: false })
  orgao: string;

  @Column({ name: 'pg', nullable: false })
  pg: string;

  @Column({ name: 'mat', nullable: false })
  mat: number;

  @Column({ name: 'ng', nullable: false })
  nomeGuerra: string;

  @Column({ name: 'funcao', nullable: false })
  funcao: string;

  @Column({
    name: 'type_user',
    nullable: false,
    type: 'enum',
    enum: UserType,
  })
  typeUser: UserType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // REALACIONAMENTOS COM OUTRAS TABELAS

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses?: AddressEntity[];

  @OneToOne(() => AlunoEntity, (aluno) => aluno.user)
  aluno?: AlunoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.useral)
  useral?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.usercom)
  usercom?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.usercmtcia)
  usercmtcia?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.userca)
  userca?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.usersubcom)
  usersubcom?: ComunicacaoEntity;

  @OneToOne(
    () => ComunicacaoEntity,
    (comunicacao) => comunicacao.userarquivador,
  )
  userarquivador?: ComunicacaoEntity;

  @OneToOne(() => AutorizacaoEntity, (autorizacao) => autorizacao.useraut)
  useraut?: AutorizacaoEntity;

  @OneToOne(() => AutorizacaoEntity, (autorizacao) => autorizacao.useralaut)
  useralaut?: AutorizacaoEntity;

  @OneToOne(() => AutorizacaoEntity, (autorizacao) => autorizacao.userdespaaut)
  userdespaaut?: AutorizacaoEntity;

  @OneToOne(() => ComentarioEntity, (comentario) => comentario.usercomentario)
  usercomentario?: ComentarioEntity;
}
