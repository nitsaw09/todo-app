import { Task } from '../../database/models/tasks';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export class TaskRepository {  
  /**
   * Retrieves all tasks from the database.
   * @returns A promise that resolves to an array of all tasks.
  */
  async findAll(query: GetTasksDto) {
    const filter: any = {};
    
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
   * Retrieves a task by its id.
   * @param id - The id of the task to retrieve.
   * @returns A promise that resolves to the task with the specified id, or null if no such task exists.
  */
  async findById(id: string) {
    return Task.findById(id).lean();
  }

  /**
   * Creates a new task in the database.
   * @param data - The data for the task to be created.
   * @returns A promise that resolves to the created task.
  */
  async create(data: CreateTaskDto) {
    const task = new Task(data);
    const saveTask = await task.save(); 
    return saveTask.toObject();
  }

  /**
   * Updates a task in the database.
   * @param id - The id of the task to update.
   * @param updateData - The data to update the task with.
   * @returns A promise that resolves to the updated task.
  */
  async update(id: string, updateData: UpdateTaskDto) {
    return Task.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  /**
   * Deletes a task from the database.
   * @param id - The id of the task to delete.
   * @returns A promise that resolves to the deleted task.
  */
  async delete(id: string) {
    return Task.findByIdAndDelete(id);
  }
}
