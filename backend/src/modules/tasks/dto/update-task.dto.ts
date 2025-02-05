import { IsString, IsIn, IsOptional, IsDateString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../../database/models/tasks';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(Object.values(TaskStatus))
  status?: string;

  @IsString()
  @IsIn(Object.values(TaskPriority))
  priority?: string;

  @IsString()
  @IsOptional()
  category?: string;
}