import { Route, Routes } from 'react-router-dom';
import SingleBook from '../components/BooksManagement/singleBook';
import Dashboard from '../components/dashboard/dashboard';
import Login, { ProtectedRoute } from '../components/UserAuthentication/login';
import Register from '../components/UserAuthentication/register';


const AppRouter = () => {
    return (
        
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/*Protected Routes*/}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>
                <Route path="/:id" element=   {<SingleBook />} />

                </Routes>
        
    )
}

export default AppRouter;