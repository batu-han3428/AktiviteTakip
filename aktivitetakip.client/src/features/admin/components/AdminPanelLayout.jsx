import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/icons-material/Category';
import Collapse from '@mui/material/Collapse';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Category from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';


const drawerWidth = 240;

const AdminPanelLayout = () => {
    const user = useSelector(state => state.auth);

    const location = useLocation();

    const navigate = useNavigate();

    // Men  a  k/kapan k state (responsive i in)
    const [mobileOpen, setMobileOpen] = useState(false);

    // "Tan mlar" alt men s n n a  k-kapal  durumu
    //  lk a  l  ta a  k
    const [openDefinitions, setOpenDefinitions] = useState(true);

    if (!user || !user.roles.includes('Admin')) {
        return <Navigate to="/calendar" replace />;
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Men  elemanlar  - yol ve isimler
    const menuItems = [
        {
            title: 'Tanimlar',
            icon: <ListItemIcon><Category /></ListItemIcon>,
            children: [
                { title: 'Kullanici Tanimlari', to: '/admin/users' },
                { title: 'Grup Tanimlari', to: '/admin/groups' },
            ],
        },
        // Di er ana men leri eklemek istersen buraya
    ];

    // Drawer i eri i
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
                }}
            >
                <Typography sx={{ flexGrow: 1 }}>
                    Admin Paneli
                </Typography>

                <IconButton
                    size="small"
                    onClick={() => navigate('/calendar')}
                    sx={{ color: '#fff' }}
                    aria-label="Ana sayfaya git"
                >
                    <HomeIcon />
                </IconButton>
            </Toolbar>
            <List>
                {menuItems.map((menu, index) => (
                    <React.Fragment key={index}>
                        <ListItemButton onClick={() => setOpenDefinitions(!openDefinitions)}>
                            {menu.icon}
                            <ListItemText primary={menu.title} />
                            {openDefinitions ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openDefinitions} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {menu.children.map((child, i) => (
                                    <ListItemButton
                                        key={i}
                                        sx={{ pl: 4 }}
                                        component={Link}
                                        to={child.to}
                                        selected={location.pathname === child.to}
                                        onClick={() => setMobileOpen(false)} // mobilde t klan nca men y  kapat
                                    >
                                        <ListItemText primary={child.title} />
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
            {/* Mobilde hamburger ikon */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="admin panel menu"
            >
                {/* Mobil drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // performans i in
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/*   erik alan  */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* Toolbar bo luk b rakmak i in */}
                <Toolbar sx={{ display: { sm: 'none' } }}>
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
                </Toolbar>

                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminPanelLayout;
