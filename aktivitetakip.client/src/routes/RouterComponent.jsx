import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CalendarPage from '../features/events/CalendarPage';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import AdminPanelLayout from '../features/admin/components/AdminPanelLayout';
import UsersPage from '../features/admin/pages/users/UsersPage';
import GroupsPage from '../features/admin/pages/groups/GroupsPage';
import Layout from '../features/common/components/Layout';
import LogoutPage from '../features/auth/LogoutPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import ForgotPassword from '../features/auth/ForgotPassword';

const RouterComponent = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />


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
                    {/* Di er admin alt sayfalar */}
                </Route>


                {/* E er tan mlanmam   route gelirse login sayfas na y nlendir */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default RouterComponent;
