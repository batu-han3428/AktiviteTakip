import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import LoginForm from './LoginForm';

const LoginPage = () => {
    return (
        <Container maxWidth="sm">
            <Paper elevation={6} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Giriþ Yap
                </Typography>
                <LoginForm />
            </Paper>
        </Container>
    );
};

export default LoginPage;
