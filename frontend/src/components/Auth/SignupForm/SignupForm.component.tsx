"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupData, signupSchema } from "./SignupForm.schema";
import { TextField } from "../../common/TextField/TextField.component";
import { Button } from "../../common/Button/Button.component";
//import { authApi } from "../../config/Api";
import { Snackbar, SnackbarProps } from "../../common/Snackbar/Snackbar.component";
import { Box, Grid, Typography, Paper, Container, Link } from "@mui/material";
import NextLink from "next/link";
import { authApi } from "@/lib/config/Api";

export const SignupForm: React.FC = () => {
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
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignupData) => {
    try {
      await authApi.signup({
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      setSnackbar({
        open: true,
        message: "Signup successful! Please log in.",
        severity: "success",
      });

      reset();
    } catch (error: any) {
      console.error("Signup error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Something went wrong!",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  {...register("email")}
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
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" disabled={isSubmitting} fullWidth variant="contained" color="primary">
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center", marginTop: 2 }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link component={NextLink} href="/auth/login" sx={{ textDecoration: "none", color: "primary.main" }}>
                    Login here
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
