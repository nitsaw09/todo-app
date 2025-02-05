import mongoose, { Schema, model, Document } from 'mongoose';

export enum TaskCategory {
  Development = 'Development',  
  Design = 'Design',
  Marketing = 'Marketing',
  Sales = 'Sales',
  Support = 'Support'
}

export enum TaskStatus {
  Completed = 'Completed',
  InCompleted = 'InCompleted'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface ITask extends Document {
  title: string;
  category: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: Date;
  createdAt?: Date; 
  updatedAt?: Date; 
}

const taskSchema = new Schema<ITask>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    title: {
      type: String,
      index: true,
      required: [true, 'Title is required'],
      trim: true   
    },
    category: {
      type: String,
      index: true,
      enum: Object.values(TaskCategory),
      required: [true, 'Category is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required'], 
      trim: true, 
    },
    status: {
      type: String,
      index: true,
      enum: Object.values(TaskStatus), 
      default: 'Open', 
    },
    priority: { 
      type: String,
      index: true, 
      enum: Object.values(TaskPriority), 
      default: 'Medium' 
    }
  },
  {
    timestamps: true, 
  }
);

export const Task = model<ITask>('Task', taskSchema);