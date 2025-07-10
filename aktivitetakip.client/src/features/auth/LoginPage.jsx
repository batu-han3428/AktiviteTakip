import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import LoginForm from './LoginForm';

const LoginPage = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Giriş Yap
                    </Typography>
                    <LoginForm />
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
