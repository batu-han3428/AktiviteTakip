import React, { useEffect, useState } from 'react';
import { TextField, Button, Link, Box, Grid, Typography, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isLoggedIn, role } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        console.log(role)
        if (isLoggedIn) {
            navigate('/calendar');
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async () => {
        dispatch(loginUser({ email, password }));
        // navigate burada deðil, isLoggedIn deðiþince useEffect tetiklenir
    };

    return (
        <Box component="form" onSubmit={e => { e.preventDefault(); handleLogin(); }} noValidate sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                label="E-posta"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
            />

            <TextField
                label="Þifre"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, mb: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Giriþ Yap'}
            </Button>

            <Grid container justifyContent="space-between">
                <Grid>
                    <Link href="/forgot-password" variant="body2">Þifremi Unuttum</Link>
                </Grid>
                <Grid>
                    <Link href="/register" variant="body2">Üye Ol</Link>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginForm;
