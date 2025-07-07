import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout'; // Çýkýþ ikonu

const Header = () => {
    const roles = useSelector((state) => state.auth.roles);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" color="primary" sx={{ top: 0, zIndex: 1100 }}>
                <Toolbar>
                    {/* Sol taraf: Logo veya baþlýk */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/calendar"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 600
                        }}
                    >
                        Aktivite Takip
                    </Typography>

                    {/* Menü Butonlarý */}
                    {roles.includes('Admin') && (
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/admin"
                            sx={{ textTransform: 'none' }}
                        >
                            Admin Paneli
                        </Button>
                    )}

                    {/* Çýkýþ Butonu (ikonlu) */}
                    <IconButton
                        component={RouterLink}
                        to="/logout"
                        color="inherit"
                        aria-label="Çýkýþ"
                        size="large"
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
