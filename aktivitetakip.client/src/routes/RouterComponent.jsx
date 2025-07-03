import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarPage from '../features/events/CalendarPage';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
//import ReportPage from './ReportPage';
//import RolesPage from './RolesPage';
import RegisterPage from '../features/auth/RegisterPage';
/*import ForgotPasswordPage from './ForgotPasswordPage';*/

const RouterComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/*<Route path="/forgot-password" element={<ForgotPasswordPage />} />*/}

                <Route
                    path="/calendar"
                    element={
                        <ProtectedRoute>
                            <CalendarPage />
                        </ProtectedRoute>
                    }
                />

                {/*<Route*/}
                {/*    path="/reportpage"*/}
                {/*    element={*/}
                {/*        <ProtectedRoute requiredRole="admin">*/}
                {/*            <ReportPage />*/}
                {/*        </ProtectedRoute>*/}
                {/*    }*/}
                {/*/>*/}

                {/*<Route*/}
                {/*    path="/rolespage"*/}
                {/*    element={*/}
                {/*        <ProtectedRoute requiredRole="admin">*/}
                {/*            <RolesPage />*/}
                {/*        </ProtectedRoute>*/}
                {/*    }*/}
                {/*/>*/}
            </Routes>
        </Router>
    );
};

export default RouterComponent;
