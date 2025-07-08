import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Category from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;

const AdminPanelLayout = () => {
    const user = useSelector(state => state.auth);
    const location = useLocation();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [openDefinitions, setOpenDefinitions] = useState(true);

    if (!user || !user.roles.includes('Admin')) {
        return <Navigate to="/calendar" replace />;
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        {
            title: 'Tanýmlar',
            icon: <Category />,
            children: [
                { title: 'Kullanici Tanimlari', to: '/admin/users' },
                { title: 'Grup Tanimlari', to: '/admin/groups' },
            ],
        },
    ];

    const drawer = (
        <div>
            <Toolbar
                sx={{
                    bgcolor: '#1976d2',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: drawerOpen ? 'flex-start' : 'center',
                    position: 'relative',
                    px: drawerOpen ? 2 : 0,
                    height: 64,
                }}
            >
                {/* Menü daraltma toggle butonu - sadece masaüstünde görünür */}
                <IconButton
                    size="small"
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    sx={{ color: '#fff', display: { xs: 'none', sm: 'inline-flex' } }}
                    aria-label={drawerOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                >
                    <MenuIcon />
                </IconButton>

                {drawerOpen && (
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ ml: 2, userSelect: 'none', flexGrow: 1 }}
                    >
                        Admin Paneli
                    </Typography>
                )}
            </Toolbar>

            <List>
                {menuItems.map((menu, index) => (
                    <React.Fragment key={index}>
                        <ListItemButton
                            onClick={() => setOpenDefinitions(!openDefinitions)}
                            sx={{ justifyContent: drawerOpen ? 'initial' : 'center', px: 2.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center' }}>
                                {menu.icon}
                            </ListItemIcon>
                            {drawerOpen && <ListItemText primary={menu.title} />}
                            {drawerOpen && (openDefinitions ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                        <Collapse in={openDefinitions} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {menu.children.map((child, i) => (
                                    <ListItemButton
                                        key={i}
                                        sx={{
                                            pl: drawerOpen ? 4 : 2,
                                            justifyContent: drawerOpen ? 'initial' : 'center',
                                        }}
                                        component={Link}
                                        to={child.to}
                                        selected={location.pathname === child.to}
                                        onClick={() => setMobileOpen(false)} // mobilde týklayýnca menüyü kapat
                                    >
                                        <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : 'auto', justifyContent: 'center' }}>
                                            <Category />
                                        </ListItemIcon>
                                        {drawerOpen && <ListItemText primary={child.title} />}
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />

            {/* Mobil drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerOpen ? drawerWidthOpen : drawerWidthClosed }, flexShrink: { sm: 0 } }}
                aria-label="admin panel menu"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // performans için
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidthOpen },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Masaüstü drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerOpen ? drawerWidthOpen : drawerWidthClosed,
                            overflowX: 'hidden',
                            transition: theme =>
                                theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                        },
                    }}
                    open={drawerOpen}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content area */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                    }}
                >
                    {/* Mobil hamburger menü */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div">
                        Admin Paneli
                    </Typography>

                    {/* Home ikonu menü daraltma yerine burada */}
                    <IconButton
                        size="small"
                        onClick={() => navigate('/calendar')}
                        sx={{ color: 'inherit' }}
                        aria-label="Ana sayfaya git"
                    >
                        <HomeIcon />
                    </IconButton>
                </Toolbar>

                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminPanelLayout;
