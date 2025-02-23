import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import "./login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loginError, user } = useSelector((state: RootState) => state.auth);
    
    const handleLogin = async () => {
        try{
            (dispatch as any)(loginUser({username, password}));
            setUsername('');
            setPassword('');
        } catch (error: any) {
            console.log(error);
        }
        
    };

    useEffect(() => {
        if (user) {
            window.location.href = '/dashboard';
        }
    }, [user]);

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {loginError && <p className="error">{loginError}</p>}
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