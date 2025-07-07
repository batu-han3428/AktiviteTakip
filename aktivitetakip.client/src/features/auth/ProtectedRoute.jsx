import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const { isLoggedIn, roles } = useSelector(state => state.auth);

    // Giriþ yapýlmamýþsa login sayfasýna yönlendir
    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Eðer role gerekiyor ve kullanýcýnýn rolü bu deðilse
    if (requiredRole) {
        const userRole = roles.length > 0 ? roles[0]?.toLowerCase() : null;
        if (userRole !== requiredRole.toLowerCase()) {
            return <Navigate to="/calendar" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
