import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, Card, TableRow, TablePagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Typography, Box, Grid, Container } from '@mui/material';
import { tasksApi } from '@/lib/config/Api';
import { Button } from '@/components/common/Button/Button.component';
import { Snackbar, SnackbarProps } from '@/components/common/Snackbar/Snackbar.component';
import { SelectField } from '@/components/common/SelectField/SelectField.component';
import { categories, priorities, statuses } from '../TaskForm/TaskForm.schema';
import { TextField } from '@/components/common/TextField/TextField.component';
import { useRouter } from 'next/navigation';

interface TaskTableProps {
  handleEditTask: (taskId: string) => void;
  refreshFlag: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({ handleEditTask, refreshFlag }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(20); 
  const [statusFilter, setStatusFilter] = useState<string>('all'); 
  const [priorityFilter, setPriorityFilter] = useState<string>('all'); 
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(''); 

  const debounceRef = useRef<any>(null);

  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    severity: "success",
  });

  const fetchTasks = async () => {
    try {
      const filters: any = {};
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (priorityFilter !== 'all') filters.priority = priorityFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (searchQuery) filters.title = searchQuery;
      const response = await tasksApi.getTasks({
        ...filters,
        page: page + 1,
        limit: rowsPerPage
      });
      setTasks(response.data.tasks);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchTasks(); 
    }, 500); 

    return () => clearTimeout(debounceRef.current);
  }, [refreshFlag, page, rowsPerPage, statusFilter, priorityFilter, searchQuery, categoryFilter]);
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId);
      setSnackbar({
        open: true,
        message: "Task deleted successfully!",
        severity: "success",
      });
      fetchTasks();
    } catch(error) {
      setSnackbar({
        open: true,
        message: "Something went wrong! Please try again.",
        severity: "error",
      });
    }
  };

  const handleViewTask = (taskId: string) => {
    router.push('/tasks/' + taskId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  
  const handleChangePage = async (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryFilterChange = async (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value as string);
    setPage(0);
  };
  
  const handleStatusFilterChange = async (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value as string);
    setPage(0);
  };

  const handlePriorityFilterChange = async (event: SelectChangeEvent<string>) => {
    setPriorityFilter(event.target.value as string);
    setPage(0);
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container>
          <Grid item xs={12}>
            <Card title="Task List" sx={{p:2}}>
              {loading ? (
                <Typography variant="h6">Loading...</Typography>
              ) : (
                <>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label="Search by Task Name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{mt:2}}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <SelectField
                        fullWidth
                        variant="standard"
                        label="Category"
                        options={[
                          { value: 'all', label: 'All' }, 
                          ...categories.map((category) => ({ value: category, label: category }))
                        ]}
                        onChange={handleCategoryFilterChange}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                    <SelectField
                        fullWidth
                        variant="standard"
                        label="Status"
                        options={[ 
                          { value: 'all', label: 'All' }, 
                          ... statuses.map((status) => ({ value: status, label: status }))
                        ]}
                        onChange={handleStatusFilterChange}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <SelectField
                        fullWidth
                        variant="standard"
                        label="Priority"
                        options={[
                          { value: 'all', label: 'All' }, 
                          ... priorities.map((priority) => ({ value: priority, label: priority }))
                        ]}
                        onChange={handlePriorityFilterChange}
                      />
                    </Grid>
                  </Grid>
                  { tasks.length > 0 ? (<TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Task Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Priority</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((task, index) => (
                          <TableRow key={index}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.category}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>{task.priority}</TableCell>
                            <TableCell>
                              <Button variant="contained" color="success" sx={{mr:1}} onClick={() => handleViewTask(task._id)}>
                                View
                              </Button>
                              <Button variant="contained" color="info" sx={{mr:1}} onClick={() => handleEditTask(task)}>
                                Edit
                              </Button>
                              <Button variant="contained" color="error" onClick={() => handleDeleteTask(task._id.toString('hex'))}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={totalRecords}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>)
                   : (
                    <Typography variant="h6">No tasks found.</Typography>
                  )}
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};
