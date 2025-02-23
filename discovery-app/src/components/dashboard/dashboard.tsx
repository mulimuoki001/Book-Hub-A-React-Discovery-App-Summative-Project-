import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../redux/slices/authSlice";
import BookComponent from "../BooksManagement/Books";



const dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    // console.log(`userInfo: ${userInfo}`);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }
    
    return (
        <div >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><h2>Dashboard</h2>
                
            <button onClick={handleLogout} style={buttonStyles}>Logout</button></div>
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