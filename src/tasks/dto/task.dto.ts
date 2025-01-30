import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

import { TaskStatus } from '../model';
import { CreateTaskLabelDto } from './task-label.dto';

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

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskLabelDto)
  labels?: CreateTaskLabelDto[];
}

// task update data transfer object
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// Id param data transfer object
export class TaskIdParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

// Filter task data transfer object
export class TaskFiltersQueries {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'Search query must be at least 3 characters long',
  })
  search?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;

    return value
      .split(',')
      .map((label) => label.trim())
      .filter((label) => label.length);
  })
  labels?: string[];

  @IsOptional()
  @IsIn(['createdAt', 'title', 'status'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], {
    message: 'Sort order must be ASC or DESC',
  })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
