import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { Task } from '../../tasks/entities';
import { UserRole } from '../model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  @Expose()
  tasks: Task[];

  @Column('text', { array: true, default: [UserRole.USER] })
  @Expose()
  roles: UserRole[];
}
