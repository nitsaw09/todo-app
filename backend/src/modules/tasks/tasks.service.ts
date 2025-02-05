import { TaskRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundError } from 'routing-controllers';
import { IResponse } from '../../utils/interceptors/interfaces/response.interface';
import { errorMessage, successMessage } from './tasks.constants';
import Logger from '../../utils/logger';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

export class TaskService {
  private logger = new Logger(TaskService.name);
  private taskRepository = new TaskRepository();

  /**
   * Retrieves all tasks from the repository.
   * @returns A promise that resolves to an object containing the data of all tasks.
  */
  async getAllTasks(query: GetTasksDto) {
    const tasks = await this.taskRepository.findAll(query);
    const response: IResponse<Object> = {};
    response.data = tasks;
    this.logger.info("Retrieved all tasks");
    return response;
  }
  
  /**
   * Retrieves a task by its id from the repository.
   * @param id - The id of the task to retrieve.
   * @returns A promise that resolves to an object containing the data of the task
   * If the task is not found, it throws a NotFoundError.
  */
  async getTaskById(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundError(errorMessage.TASK_NOTFOUND);
    const response: IResponse<Object> = {};
    response.data = task;
    this.logger.info("Retrieved task by id");
    return task;
  }

  /**
   * Creates a new task in the repository.
   * @param data - The data for the task to be created.
   * @returns A promise that resolves to an object containing the created task data and a success message.
  */
  async createTask(data: CreateTaskDto) {
    const newTask = await this.taskRepository.create(data);
    const response: IResponse<Object> = {};
    response.data = newTask;
    response.message = successMessage.TASK_CREATED;
    this.logger.success("Task created successfully");
    return response;
  }

  /**
   * Updates a task in the repository.
   * @param id - The id of the task to update.
   * @param updateData - The data to update the task with.
   * @returns A promise that resolves to an object containing the updated task data and a success message.
   * If the task is not found, it throws a NotFoundError.
  */
  async updateTask(id: string, updateData: UpdateTaskDto) {
    const updatedTask = await this.taskRepository.update(id, updateData);
    if (!updatedTask) throw new NotFoundError(errorMessage.TASK_NOTFOUND);
    const response: IResponse<Object> = {};
    response.data = updatedTask;
    response.message = successMessage.TASK_UPDATED;
    this.logger.success("Task updated successfully");
    return response;
  }

  
  /**
   * Deletes a task from the repository.
   * @param id - The id of the task to delete.
   * @returns A promise that resolves to an object containing a success message.
   * If the task is not found, it throws a NotFoundError.
  */
  async deleteTask(id: string) {
    const deletedTask = await this.taskRepository.delete(id);
    if (!deletedTask) throw new NotFoundError(errorMessage.TASK_NOTFOUND);
    const response: IResponse<Object> = {};
    response.message = successMessage.TASK_DELETED;
    this.logger.success("Task deleted successfully");
    return response;
  }
}
