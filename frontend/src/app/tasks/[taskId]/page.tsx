'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Card, CardContent, Typography, Chip, CircularProgress } from "@mui/material";
import { tasksApi } from "@/lib/config/Api";
import { Button } from "@/components/common/Button/Button.component";

export default function TaskViewPage() {
  const { taskId: id } = useParams()
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    category: ""
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    tasksApi.getTask(id as string)
      .then((data) => {
        console.log(data)
        setTask(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    
  }, []);

  const handleBackClick = () => {
    router.push('/tasks');
  }

  if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  if (!task) return <Typography textAlign="center">Task not found.</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Button onClick={handleBackClick} variant="text" sx={{mb:1}}>Back</Button>
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            {task?.title}
          </Typography>

          <Typography variant="body1" align="justify" color="textSecondary" sx={{ mb: 2 }}>
            {task?.description}
          </Typography>
          
          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
            Category: {task?.category}
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
            Status: {task?.status}
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2 }}>
            Priority: {task?.priority}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};
