import { Route, Routes } from 'react-router-dom';
import Login from '../components/UserAuthentication/login';
import Register from '../components/UserAuthentication/register';
import Dashboard from '../components/dashboard/dashboard';
import ProtectedRoute from './protectedRoute';


const AppRouter = () => {
    return (
        
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/*Protected Routes*/}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
    )
}

export default AppRouter;