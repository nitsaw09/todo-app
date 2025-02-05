import { Task } from '../../database/models/tasks';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export class TaskRepository {  
  /**
   * Retrieves all user tasks from the database.
   * @returns A promise that resolves to an array of all tasks.
  */
  async findAll(userId: string, query: GetTasksDto) {
    const filter: any = {};
    
    filter.createdBy = userId;

    if (query.title) filter.title = { $regex: query.title, $options: "i" };
    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.priority) filter.priority = query.priority;

    const page = Number(query.page) || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter).skip(skip).limit(limit).lean();
    const total = await Task.countDocuments(filter);

    return { tasks, total, page, totalPages: Math.ceil(total / limit) };
  }


  /**
   * Retrieves a user task by its id and userId.
   * @param userId - The current user id.
   * @param id - The id of the task to retrieve.
   * @returns A promise that resolves to the task with the specified id, or null if no such task exists.
  */
  async findById(userId: string, id: string) {
    return Task.findById(id).where({ createdBy: userId }).lean();
  }

  /**
   * Creates a new user task in the database.
   * @param userId - The current user id.
   * @param data - The data for the task to be created.
   * @returns A promise that resolves to the created task.
  */
  async create(userId: string, data: CreateTaskDto) {
    const task = new Task({ ...data, userId });
    const saveTask = await task.save(); 
    return saveTask.toObject();
  }

  /**
   * Updates a user task in the database.
   * @param userId - The current user id.
   * @param id - The id of the task to update.
   * @param updateData - The data to update the task with.
   * @returns A promise that resolves to the updated task.
  */
  async update(userId: string, id: string, updateData: UpdateTaskDto) {
    return Task
      .findByIdAndUpdate(id, updateData, { new: true })
      .where({ createdBy: userId })
      .lean();
  }

  /**
   * Deletes a user task from the database.
   * @param userId - The current user id.
   * @param id - The id of the task to delete.
   * @returns A promise that resolves to the deleted task.
  */
  async delete(userId: string, id: string) {
    return Task.findByIdAndDelete(id).where({ createdBy: userId });
  }
}
