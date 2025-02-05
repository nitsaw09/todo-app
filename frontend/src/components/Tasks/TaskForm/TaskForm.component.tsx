"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categories, priorities, statuses, TaskData, taskSchema } from "./TaskForm.schema";
import { TextField } from "../../common/TextField/TextField.component";
import { Button } from "../../common/Button/Button.component";
import { Snackbar, SnackbarProps } from "../../common/Snackbar/Snackbar.component";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { SelectField } from "@/components/common/SelectField/SelectField.component";
import { ITaskData, tasksApi } from "@/lib/config/Api";

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    task?: ITaskData | null;
    onTaskSubmitted: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task, onTaskSubmitted }) => {
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    severity: "success",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskData>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
  });

  // Populate form fields when a task is provided
  useEffect(() => {
    if (task) {
      Object.keys(task).forEach((key) => {
        setValue(key as keyof TaskData, (task as any)[key]);
      });
    } else {
      reset(); 
    }
  }, [task, setValue, reset]);

  const onSubmit = async (data: TaskData) => {
    try {
      if (task) {
        // Update task
        await tasksApi.updateTask(String(task?._id), data);
        setSnackbar({ open: true, message: "Task updated successfully!", severity: "success" });
      } else {
        // Create new task
        await tasksApi.createTask(data);
        setSnackbar({ open: true, message: "Task created successfully!", severity: "success" });
      }
      setTimeout(() => {
        onClose();
        onTaskSubmitted();
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting task:", error);
      setSnackbar({ open: true, message: "Something went wrong! Please try again.", severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            label="Title" 
            {...register("title")} 
            error={!!errors.title} 
            helperText={errors.title?.message} 
            fullWidth 
          />
          
          <TextField 
            label="Description" 
            {...register("description")} 
            error={!!errors.description} 
            helperText={errors.description?.message} 
            sx={{mt:2 }} 
            fullWidth multiline 
          />
          
          <SelectField 
            label="Category" 
            value={watch("category")} 
            {...register("category")} 
            options={categories.map(c => ({ value: c, label: c }))} 
            error={!!errors.category} 
            onChange={(event) => setValue("category", event.target.value as TaskData["category"])}
          />
          
          <SelectField 
            label="Priority" 
            value={watch("priority")}
            {...register("priority")} 
            options={priorities.map(p => ({ value: p, label: p }))} 
            error={!!errors.priority} 
            onChange={(event) => setValue("priority", event.target.value as TaskData["priority"])}
          />
          
          <SelectField 
            label="Status" 
            value={watch("status")}
            {...register("status")} 
            options={statuses.map(s => ({ value: s, label: s }))} 
            error={!!errors.status} 
            onChange={(event) => setValue("status", event.target.value as TaskData["status"])}
          />
          
          <DialogActions>
            <Button onClick={onClose} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {task ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Snackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </Dialog>
  );
};
