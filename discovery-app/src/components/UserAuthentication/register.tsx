import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import './register.css';



const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { registerError } = useSelector((state: RootState) => state.auth);

    const handleRegister = async() => {
        try{
            const response = (dispatch as any)(registerUser({username, password, email}));
            setEmail('');
                setPassword('');
                setUsername('');
            if(response.payload){
                alert('User registered successfully');
                
            }
            
        } catch (error) {
            console.error('Error registering user:', error);
        }
        
        
    };


    return (
        <div className="register-page">
            <h2>Register</h2>
            {registerError && <p className="error">{registerError}</p>}
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            
            <button onClick={handleRegister}>Register</button>

            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
};

export default RegisterPage;