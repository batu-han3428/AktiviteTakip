import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Typography,
    Paper,
} from '@mui/material';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Sunucu hatası oluştu');
            }

            setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        } catch (err) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
            }}
        >
            <Paper elevation={4} sx={{ p: 4, maxWidth: 420, width: '100%', borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
                    Şifremi Unuttum
                </Typography>

                <Typography variant="body2" textAlign="center" color="text.secondary" mb={2}>
                    Lütfen kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı size gönderilecektir.
                </Typography>

                <form onSubmit={handleSubmit} noValidate>
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        label="E-posta Adresiniz"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || !email}
                        sx={{ mt: 2, py: 1.5, fontWeight: 500 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sıfırlama Bağlantısı Gönder'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;
