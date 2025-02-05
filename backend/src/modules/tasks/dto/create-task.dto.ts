import { IsString, IsNotEmpty, IsIn, IsOptional, IsDateString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../../database/models/tasks';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(Object.values(TaskStatus))
  status: string;

  @IsString()
  @IsIn(Object.values(TaskPriority))
  priority: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}