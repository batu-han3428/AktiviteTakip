import React from 'react';
import { Container, Paper, Typography, Grid, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
    return (
        <Container maxWidth="sm">
            <Paper elevation={6} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Üye Ol
                </Typography>
                <RegisterForm />
                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Zaten üye misiniz? Giriş Yap
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
