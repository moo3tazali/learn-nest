import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TaskStatus } from '../model';
import { User } from 'src/users/entities';
import { TaskLabel } from './task-label.entity';

/**
 * Task entity.
 * Represents a single task in the database.
 * You can use this entity to define database shcema and interact with the database using TypeORM queries.
 */
@Entity()
export class Task {
  /**
   * Unique identifier for the task.
   * Automatically generated by the database.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Title of the task.
   * Required.
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false, // the default value is false already
  })
  title: string;

  /**
   * Description of the task.
   * Required.
   */
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  /**
   * Status of the task.
   * One of the values defined in the TaskStatus enum.
   * Default value is TaskStatus.OPEN.
   */
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  // Timestamps are automatically managed by TypeORM
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @Column()
  userId: string;

  // Add relationship to User entity
  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  // add realtionship to task labels
  @OneToMany(() => TaskLabel, (taskLabel) => taskLabel.task, {
    // remove all task labels when task is removed
    cascade: true,
  })
  labels: TaskLabel[];
}
