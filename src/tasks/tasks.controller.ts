import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto, TaskIdDto, UpdateTaskDto } from './task.dto';
import { WrongTaskStatusException } from './exceptions';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // find all tasks
  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  // find one task by id
  @Get(':id')
  public findOne(@Param() params: TaskIdDto): ITask {
    return this.findOneOrFail(params.id);
  }

  // create a new task
  @Post()
  public create(@Body() body: CreateTaskDto): ITask {
    return this.tasksService.create(body);
  }

  // update a task
  @Patch(':id')
  public update(
    @Param() params: TaskIdDto,
    @Body() body: UpdateTaskDto,
  ): ITask {
    const task = this.findOneOrFail(params.id);

    try {
      return this.tasksService.update(task, body);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  // delete a task
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param() params: TaskIdDto): void {
    const task = this.findOneOrFail(params.id);
    this.tasksService.delete(task);
  }

  // private method find one or fail
  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id [${id}] not found`);
    }

    return task;
  }
}
