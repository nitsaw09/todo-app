'use client';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '../../common/TextField/TextField.component';
import { Button } from '../../common/Button/Button.component';
import { loginSchema, LoginData } from './LoginForm.schema';
import { Box, Grid, Typography, Paper, Container, Link } from '@mui/material';
import NextLink from 'next/link';
import { authApi } from '@/lib/config/Api';
import { SnackbarProps, Snackbar } from '../../common/Snackbar/Snackbar.component';
import { useRouter } from 'next/navigation';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    severity: "success"
 });
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: LoginData) => {
    try {
        const tokenData = await authApi.login({
          email: data.email,
          password: data.password
        });

        const authToken = tokenData.data.token;
        localStorage.setItem('authToken', authToken);

        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        console.log(tokenData.data.token)
        router.push('/tasks');
    } catch (error: any) {
        console.error("login error:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Something went wrong!",
          severity: "error",
        });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" disabled={isSubmitting} fullWidth variant="contained" color="primary">
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link component={NextLink} href="/auth/signup" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                    Sign up here
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
          <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
           />
        </Paper>
      </Container>
    </Box>
  );
};
