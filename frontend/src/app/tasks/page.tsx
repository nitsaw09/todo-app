'use client';
import { useContext, useEffect, useState } from 'react';
import { Button, Container, Grid, Box, Typography } from '@mui/material';
import { TaskTable } from '../../components/Tasks/TaskTable/TaskTable.component'; 
import { TaskForm } from '../../components/Tasks/TaskForm/TaskForm.component'; 
import { AuthContext } from '@/lib/context/Auth.context';

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const [openTaskForm, setOpenTaskForm] = useState(false);
  
  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setOpenTaskForm(true);
  };

  const handleOpenTaskForm = () => {
    setSelectedTask(null);
    setOpenTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setOpenTaskForm(false);
  };

  const handleTaskSubmitted = () => {
    setRefreshFlag((prev) => !prev);
  };

  useEffect(() => auth.setIsLoggedIn(true), []);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Task Management
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenTaskForm}>
              Create Task
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TaskTable handleEditTask={handleEditTask} refreshFlag={refreshFlag} /> 
          </Grid>
        </Grid>
      </Container>
      <TaskForm open={openTaskForm} task={selectedTask} onClose={handleCloseTaskForm} onTaskSubmitted={handleTaskSubmitted} />
    </Box>
  );
};

