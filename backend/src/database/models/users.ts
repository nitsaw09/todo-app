import mongoose, { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt?: Date; 
  updatedAt?: Date; 
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true   
    },
    email: {
      type: String,
      required: [true, 'Email is required'], 
      trim: true, 
    },
    password: {
      type: String,
      required: [true, 'Password is required'], 
      trim: true, 
    }
  },
  {
    timestamps: true, 
  }
);

export const User = model<IUser>('User', userSchema);