import React, { useState } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [localError, setLocalError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (password !== passwordConfirm) {
            setLocalError('Þifreler uyuþmuyor!');
            return;
        }

        const resultAction = await dispatch(registerUser({ username, email, password }));
        if (registerUser.fulfilled.match(resultAction)) {
            alert('Kayýt baþarýlý! Giriþ sayfasýna yönlendiriliyorsunuz.');
            navigate('/login');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                label="Kullanýcý Adý"
                fullWidth
                required
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="E-posta Adresi"
                type="email"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Þifre"
                type="password"
                fullWidth
                required
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                label="Þifre Tekrar"
                type="password"
                fullWidth
                required
                margin="normal"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, mb: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Kayýt Ol'}
            </Button>
        </Box>
    );
};

export default RegisterForm;
