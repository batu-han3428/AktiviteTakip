import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CalendarPage from '../features/events/CalendarPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import AdminPanelLayout from '../features/admin/components/AdminPanelLayout';
import UsersPage from '../features/admin/pages/UsersPage';
import GroupsPage from '../features/admin/pages/GroupsPage';
import Layout from '../features/common/components/Layout';
import LogoutPage from '../features/auth/LogoutPage';

const RouterComponent = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/logout" element={<LogoutPage />} />

                {/* Protected Calendar */}
                {/*<Route*/}
                {/*    path="/calendar"*/}
                {/*    element={*/}
                {/*        <ProtectedRoute>*/}
                {/*            <CalendarPage />*/}
                {/*        </ProtectedRoute>*/}
                {/*    }*/}
                {/*/>*/}

                {/*<Route*/}
                {/*    element={*/}
                {/*        <ProtectedRoute>*/}
                {/*            <Layout />*/}
                {/*        </ProtectedRoute>*/}
                {/*    }*/}
                {/*>*/}
                {/*    <Route path="/calendar" element={<CalendarPage />} />*/}
                {/*</Route>*/}
                <Route
                    path="/calendar"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <CalendarPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />



                {/* Admin paneli layout ve nested routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPanelLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="users" replace />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="groups" element={<GroupsPage />} />
                    {/* Diðer admin alt sayfalar */}
                </Route>


                {/* Eðer tanýmlanmamýþ route gelirse login sayfasýna yönlendir */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default RouterComponent;
