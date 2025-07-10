import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyResetToken, resetPassword } from "../auth/authSlice";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    const { isResetTokenValid, resetPasswordStatus, resetPasswordError } = useSelector(
        (state) => state.auth
    );

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    useEffect(() => {
        if (userId && token) {
            dispatch(verifyResetToken({ userId, token }));
        }
    }, [dispatch, userId, token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError(null);
        setSuccessMessage(null);

        if (newPassword !== confirmPassword) {
            setLocalError(" ifreler e le miyor.");
            return;
        }

        dispatch(resetPassword({ userId, token, newPassword }))
            .unwrap()
            .then(() => {
                setSuccessMessage(" ifre ba ar yla s f rland . Giri  sayfas na y nlendiriliyorsunuz...");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            })
            .catch(() => { });
    };

    if (isResetTokenValid === null)
        return (
            <Typography variant="h6" align="center" mt={4}>
                Token kontrol ediliyor...
            </Typography>
        );

    if (isResetTokenValid === false)
        return (
            <Typography variant="h6" align="center" mt={4} color="error">
                Ge ersiz veya s resi dolmu  link. Yeni  ifre talebinde bulununuz.
            </Typography>
        );

    return (
        <Grid
            container
            size="grow"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "100vh", padding: 16 }}
        >
            <Grid size={{ xs: 12, sm: 8, md: 5, lg: 4 }}>
                <Paper elevation={3} style={{ padding: 24 }}>

                    <Typography variant="h4" gutterBottom align="center" sx={{ mb: 2 }}>

                         Şifre Sıfırlama
                    </Typography>

                    {(localError || resetPasswordError) && (
                        <Alert severity="error" style={{ marginBottom: 16 }}>
                            {localError || resetPasswordError}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert severity="success" style={{ marginBottom: 16 }}>
                            {successMessage}
                        </Alert>
                    )}

                    {!successMessage && (
                        <form onSubmit={handleSubmit} noValidate>
                            <TextField
                                label="Yeni  ifre"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                required
                                minLength={6}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                margin="normal"
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                aria-label="Şifreyi göster/gizle"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Yeni  ifre (Tekrar)"
                                type={showConfirmPassword ? "text" : "password"}
                                fullWidth
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                edge="end"
                                                aria-label=" ifreyi g ster/gizle"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={resetPasswordStatus === "loading"}
                                sx={{ mt: 3 }}
                            >
                                {resetPasswordStatus === "loading" ? "G nderiliyor..." : " ifreyi S f rla"}
                            </Button>
                        </form>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ResetPasswordPage;
