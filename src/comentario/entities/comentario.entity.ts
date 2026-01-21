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

@Entity({ name: 'comentario' })
export class ComentarioEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id_comentario', nullable: false })
  userIdComentario: number;

  @Column({ name: 'comentario', nullable: false })
  comentario: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.usercomentario)
  @JoinColumn({ name: 'user_id_comentario', referencedColumnName: 'id' })
  usercomentario?: UserEntity;
}
