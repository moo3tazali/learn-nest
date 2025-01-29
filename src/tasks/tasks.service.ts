import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ITask, TaskStatus } from './task.model';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { WrongTaskStatusException } from './exceptions';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  findAll(): ITask[] {
    return this.tasks;
  }

  findOne(id: string): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  create(task: CreateTaskDto): ITask {
    const newTask: ITask = {
      id: randomUUID(),
      ...task,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(task: ITask, updatedTask: UpdateTaskDto): ITask {
    if (
      updatedTask.status &&
      !this.isValidStatusTransition(task.status, updatedTask.status)
    ) {
      throw new WrongTaskStatusException();
    }
    Object.assign(task, updatedTask);
    return task;
  }

  delete(task: ITask): void {
    this.tasks = this.tasks.filter(
      (filteredTask) => filteredTask.id !== task.id,
    );
  }

  private isValidStatusTransition(
    current: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    return (
      statusOrder.indexOf(current) <= statusOrder.indexOf(newStatus)
    );
  }
}
