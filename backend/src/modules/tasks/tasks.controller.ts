import { Get, Post, Body, QueryParams, Param, Put, Delete, HttpCode, JsonController, UseBefore, CurrentUser } from 'routing-controllers';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { OpenAPI } from 'routing-controllers-openapi';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthMiddleware } from '../../utils/middlewares/auth.middleware';
import { GetTasksDto } from './dto/get-tasks.dto';

@JsonController('/v1/tasks')
@UseBefore(AuthMiddleware)
export class TaskController {
  private taskService: TaskService;
  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Retrieves all user tasks from the database.
   * @returns A promise that resolves to an array of all tasks.
  */
  @Get('/')
  @OpenAPI({ 
    summary: 'Get all tasks',
    security: [{ bearerAuth: [] }] 
  })
  async getAllTasks(
    @CurrentUser() currentUser: { userId: string }, 
    @QueryParams() query: GetTasksDto
  ) {
    return await this.taskService.getAllTasks(currentUser?.userId, query);
  }

  /**
   * Creates a new user task in the database.
   * @param createTaskDto - The data for the task to be created.
   * @returns A promise that resolves to the created task.
  */
  @Post('/')
  @OpenAPI({ 
    summary: 'Create new task',
    security: [{ bearerAuth: [] }],
    responses: {
      '201': {
        description: 'Created task'
      },
    }
  })
  @HttpCode(201)
  async createTask(
    @CurrentUser() currentUser: { userId: string }, 
    @Body() createTaskDto: CreateTaskDto
  ) {
    return await this.taskService.createTask(currentUser?.userId, createTaskDto);
  }

  /**
   * Retrieves a user task by its id and userId.
   * @param userId - The current user id.
   * @param id - The id of the task to retrieve.
   * @returns A promise that resolves to the task with the specified id, or null if no such task exists.
  */
  @Get('/:id')
  @OpenAPI({ 
    summary: 'Get task by id',
    security: [{ bearerAuth: [] }] 
  })
  async getTaskById(
    @CurrentUser() currentUser: { userId: string }, 
    @Param('id') id: string
  ) {
    return await this.taskService.getTaskById(currentUser?.userId, id);
  }

  /**
   * Updates a user task in the database.
   * @param userId - The current user id.
   * @param id - The id of the task to update.
   * @param updateTaskDto - The data to update the task with.
   * @returns A promise that resolves to the updated task.
  */
  @Put('/:id')
  @OpenAPI({ 
    summary: 'Updated task by id',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'Task updated'
      },
      '404': {
        description: 'Task not found'
      }
    }
   })
  async updateTask(
    @CurrentUser() currentUser: { userId: string }, 
    @Param('id') id: string, 
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return await this.taskService.updateTask(currentUser?.userId, id, updateTaskDto);
  }

  /**
   * Deletes a user task from the database.
   * @param userId - The current user id.
   * @param id - The id of the task to delete.
   * @returns A promise that resolves to a response indicating the task was deleted.
  */
  @Delete('/:id')
  @OpenAPI({ 
    summary: 'Deleted task by id',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'Task Deleted'
      },
      '404': {
        description: 'Task not found'
      }
    }
  })
  async deleteTask(
    @CurrentUser() currentUser: { userId: string }, 
    @Param('id') id: string
  ) {
    return await this.taskService.deleteTask(currentUser?.userId, id);
  }
}
