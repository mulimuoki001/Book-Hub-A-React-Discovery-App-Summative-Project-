import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';


const ProtectedRoute = () => {
        const {isAuthenticated} = useSelector((state: RootState) => state.auth);
        console.log(isAuthenticated);
        return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
    };
    
    export default ProtectedRoute;