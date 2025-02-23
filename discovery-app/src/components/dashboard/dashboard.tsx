import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../redux/slices/authSlice";
import BookComponent from "../BooksManagement/Books";
const dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }
    return (
        <div>
            <h1>Welcome to the Books Dashboard</h1>
            <button onClick={handleLogout} style={buttonStyles}>Logout</button>
            <BookComponent />
        </div>
    )
};

const buttonStyles = {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default dashboard;