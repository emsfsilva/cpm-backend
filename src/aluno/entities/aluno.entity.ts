import { UserEntity } from 'src/user/entities/user.entity';
import { TurmaEntity } from '../../turma/entities/turma.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'aluno' })
export class AlunoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'resp1', nullable: false })
  resp1: string;

  @Column({ name: 'resp2', nullable: false })
  resp2: string;

  @Column({ name: 'turma_id', nullable: false })
  turmaId: number;

  @Column({ name: 'grau_inicial', type: 'float', nullable: false })
  grauInicial: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TurmaEntity, (turma: TurmaEntity) => turma.alunos)
  @JoinColumn({ name: 'turma_id', referencedColumnName: 'id' })
  turma?: TurmaEntity;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.aluno) // Relacionamento ManyToOne com UserEntity
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // Chave estrangeira user_id
  user?: UserEntity;
}
