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
import { AdmEntity } from 'src/adm/entities/adm.entity';
import { CaEntity } from 'src/ca/entities/ca.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false })
  email: string;

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

  // Tipos: 4 = Admin, 3 = Professor, 2 = Monior, 1 = Aluno
  // Agora tipo de usuário pode ser Aluno, Monitor, Professor ou Admin
  @Column({
    name: 'type_user',
    nullable: false,
    type: 'enum',
    enum: UserType, // Aqui você usa o enum atualizado
  })
  typeUser: UserType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses?: AddressEntity[];

  @OneToOne(() => AlunoEntity, (aluno) => aluno.user)
  aluno?: AlunoEntity;

  @OneToOne(() => AdmEntity, (adm) => adm.user)
  adm?: AdmEntity;

  @OneToOne(() => CaEntity, (ca) => ca.user)
  ca?: CaEntity;
}
