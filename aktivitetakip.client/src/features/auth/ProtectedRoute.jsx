import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const { isLoggedIn, roles } = useSelector(state => state.auth);

    // Giriş yapılmamışsa login sayfasına yönlendir
    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Eğer role gerekiyor ve kullanıcının rolü bu değilse
    if (requiredRole) {
        const userRole = roles.length > 0 ? roles[0]?.toLowerCase() : null;
        if (userRole !== requiredRole.toLowerCase()) {
            return <Navigate to="/calendar" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
