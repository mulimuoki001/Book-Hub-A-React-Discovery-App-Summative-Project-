import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
interface User  {
    id: number;
    username: string;
    password: string;
    email: string;

}
interface AuthState {
    user: User | null,
    isAuthenticated: boolean,
    loginError: string | null
    registerError: string | null
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loginError: null,
    registerError: null
}

export const registerUser = createAsyncThunk('auth/registerUser', async ({email, username, password}: {username: string, password: string, email: string}, {rejectWithValue}) => {
    try{const response = await axios.post('http://localhost:5000/api/auth/register', {email, username, password});
    const userData = response.data;
    console.log(userData);
    return userData;
    } catch (error: any) {
        const errorData = error.response?.data.message || "Something went wrong";
        console.log(errorData);
        return rejectWithValue(errorData);
    }
})

export const loginUser = createAsyncThunk('auth/loginUser', async ({username, password}: {username: string, password: string}, {rejectWithValue}) => {
    try{
        const response = await axios.post('http://localhost:5000/api/auth/login', {username, password});
        const userData = response.data;
        console.log(userData);
        return userData;
    }catch(error: any){
        const errorData = error.response?.data.message || "Something went wrong";
        console.log(errorData);
        return rejectWithValue(errorData);

    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = false;
            state.registerError = null;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
            state.registerError = action.payload as string;
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loginError = null;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loginError = action.payload as string;
        });
    }
});

export const {logout} = authSlice.actions;
export default authSlice.reducer