import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'autorizacao' })
export class AutorizacaoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  // DADOS DO COMUNCANTE
  @Column({ name: 'user_id_aut', nullable: false })
  userIdAut: number;

  @Column({ name: 'user_id_al_aut', nullable: false })
  userIdAlAut: number;

  @Column({ name: 'motivo_aut', nullable: false })
  motivoAut: string;

  @Column({ name: 'datainicio', nullable: false })
  dataInicio: string;

  @Column({ name: 'datafinal', nullable: false })
  dataFinal: string;

  @Column({ name: 'horainicio', length: 5, nullable: false })
  horaInicio: string;

  @Column({ name: 'horafinal', length: 5, nullable: false })
  horaFinal: string;

  @Column({ name: 'seg', nullable: true })
  seg: string;

  @Column({ name: 'ter', nullable: true })
  ter: string;

  @Column({ name: 'qua', nullable: true })
  qua: string;

  @Column({ name: 'qui', nullable: true })
  qui: string;

  @Column({ name: 'sex', nullable: true })
  sex: string;

  @Column({ name: 'sab', nullable: true })
  sab: string;

  @Column({ name: 'dom', nullable: true })
  dom: string;

  @Column({ name: 'user_id_despa_aut', nullable: true })
  userIdDespaAut: number;

  @Column({ name: 'despacho', nullable: true })
  despacho: string;

  @CreateDateColumn({ name: 'datadespacho', nullable: true })
  datadespacho: Date;

  @Column({ name: 'status_aut', nullable: false })
  statusAut: string;

  @Column({ name: 'obs_aut', nullable: false })
  obsAut: string;

  @Column({ name: 'situacao_atual', nullable: false })
  situacaoAtual: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.useraut)
  @JoinColumn({ name: 'user_id_aut', referencedColumnName: 'id' })
  useraut?: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.useralaut)
  @JoinColumn({ name: 'user_id_al_aut', referencedColumnName: 'id' })
  useralaut?: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.userdespaaut)
  @JoinColumn({ name: 'user_id_despa_aut', referencedColumnName: 'id' })
  userdespaaut?: UserEntity;
}
