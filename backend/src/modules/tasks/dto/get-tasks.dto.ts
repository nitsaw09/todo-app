import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskCategory, TaskPriority, TaskStatus } from '../../../database/models/tasks';

export class GetTasksDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be one of: Pending, In Progress, Completed, Blocked' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskCategory, { message: 'Category must be one of: Development, Design, Marketing, Sales, Support' })
  category?: TaskCategory;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be one of: Low, Medium, High' })
  priority?: TaskPriority;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number;
}