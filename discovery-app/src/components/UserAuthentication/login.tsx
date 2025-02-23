import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import "./login.css";

export const ProtectedRoute = () => {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);
    console.log(`isAuthenticated: ${isAuthenticated}`);
    return isAuthenticated ? <Outlet /> : (<Navigate to="/login" />);
}
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
    // console.log(`isAuthenticated: ${isAuthenticated}`);
    
    const handleLogin = async () => {
        try {
            const response = await (dispatch as any)(loginUser({username, password}));
            if(response.payload.message === 'Login successful'){
                setLoginErrorMessage(null);
                console.log(`Login successful for user: ${username} `);
                window.location.href = '/';
                
            }else{
                setLoginErrorMessage(response.payload);
            }
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error('Error logging in user:', error);
        }
        
    };

    // console.log(`isAuthenticated: ${isAuthenticated}`);

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {loginErrorMessage && <p className="error">{loginErrorMessage}</p>}
            <form className="login-form">
                <label className="login-label">Username:
                    <input className="login-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label className="login-label">Password:
                    <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button className="login-button" type="button" onClick={handleLogin}>Login</button>
                <p className="login-register-link">Don't have an account? <a href="/register">Register</a></p>
                </form>
        </div>
    );
}

export default Login;