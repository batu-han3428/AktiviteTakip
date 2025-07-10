import React, { useEffect, useState } from 'react';
import { TextField, Button, Link, Box, Grid, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';  // ikonlar
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isLoggedIn } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // şifre görünürlük durumu

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/calendar');
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async () => {
        dispatch(loginUser({ email, password }));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault(); 
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
                label="Şifre"
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, mb: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>

            <Grid container justifyContent="space-between">
                <Grid>
                    <Link href="/forgot-password" variant="body2">Şifremi Unuttum</Link>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginForm;
