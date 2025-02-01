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
  Query,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  CreateTaskLabelDto,
  TaskFiltersQueries,
  TaskIdParams,
  UpdateTaskDto,
} from './dto';
import { WrongTaskStatusException } from './exceptions';
import { Task } from './entities';
import { PaginationQueries, PaginationResponse } from '../common';
import { Auth } from '../users/decorators';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // add labels to task
  @Post(':id/labels')
  public async addLabels(
    @Param() params: TaskIdParams,
    @Body() body: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);

    return this.tasksService.addLabels(task, body);
  }

  // Remove labels from task
  @Delete(':id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeLabels(
    @Param() params: TaskIdParams,
    @Body() body: string[],
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id);

    await this.tasksService.removeLabels(task, body);
  }

  // find all tasks
  @Get()
  public async findAll(
    @Query() filters: TaskFiltersQueries,
    @Query() pagination: PaginationQueries,
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(
      filters,
      pagination,
    );

    return {
      data: items,
      meta: {
        total,
        ...pagination,
      },
    };
  }

  // find one task by id
  @Get(':id')
  public async findOne(@Param() params: TaskIdParams): Promise<Task> {
    return this.findOneOrFail(params.id);
  }

  // create a new task
  @Post()
  public async create(
    @Auth('sub') userId: string,
    @Body() body: CreateTaskDto,
  ): Promise<Task> {
    const task = { ...body, userId };

    return this.tasksService.create(task);
  }

  // update a task
  @Patch(':id')
  public async update(
    @Param() params: TaskIdParams,
    @Body() body: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);

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
  public async delete(@Param() params: TaskIdParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.delete(task);
  }

  // private methods
  //
  //
  //
  // find one or fail
  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id [${id}] not found`);
    }

    return task;
  }
}
