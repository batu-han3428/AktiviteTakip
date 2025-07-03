import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const { isLoggedIn, roles } = useSelector(state => state.auth);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const userRole = roles.length > 0 ? roles[0] : null;

    if (requiredRole && userRole !== requiredRole) {
        if (location.pathname !== '/calendar') {
            return <Navigate to="/calendar" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
