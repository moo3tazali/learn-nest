import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

import { TaskStatus } from './task.model';
import { PartialType } from '@nestjs/mapped-types';

// task data transfer object
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

// task update data transfer object
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// Id param data transfer object
export class TaskIdDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
