import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log(res)
            console.log(data)
            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Login failed');
            }

            if (!data.token || typeof data.token !== 'string' || data.token.trim() === '') {
                return thunkAPI.rejectWithValue('Token is missing or invalid');
            }

            return data.token;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, email, password }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Registration failed');
            }

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const token = localStorage.getItem('token');

let user = null;
let roles = [];
let isLoggedIn = false;


if (token) {
    try {
        const decoded = jwtDecode(token);

        // Token süresi kontrolü
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
            // Token süresi dolmuþ
            localStorage.removeItem('token');
        } else {
            const nameIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
            const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
            const emailClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
            const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

            user = decoded[nameClaim] || decoded[emailClaim] || decoded[nameIdClaim] || null;

            const rawRole = decoded[roleClaim];
            if (Array.isArray(rawRole)) {
                roles = rawRole;
            } else if (typeof rawRole === 'string') {
                roles = [rawRole];
            }

            isLoggedIn = true;
        }
    } catch {
        localStorage.removeItem('token');
    }
}

const initialState = {
    token,
    user,
    roles,
    isLoggedIn,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
            state.roles = [];
            state.isLoggedIn = false;
            state.error = null;
            localStorage.removeItem('token');
        },
        setCredentials(state, action) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.roles = action.payload.roles || [];
            state.isLoggedIn = true;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;

                const token = action.payload;

                if (typeof token !== 'string' || token.trim() === '') {
                    state.error = 'Invalid token received';
                    state.token = null;
                    state.user = null;
                    state.roles = [];
                    state.isLoggedIn = false;
                    localStorage.removeItem('token');
                    return;
                }

                state.token = token;

                try {
                    const decoded = jwtDecode(token);

                    const nameIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                    const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                    const emailClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
                    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

                    const user = decoded[nameClaim] || decoded[emailClaim] || decoded[nameIdClaim] || null;

                    const rawRole = decoded[roleClaim];
                    let roles = [];
                    if (Array.isArray(rawRole)) {
                        roles = rawRole;
                    } else if (typeof rawRole === 'string') {
                        roles = [rawRole];
                    }

                    state.roles = roles;
                    state.user = user;
                    state.isLoggedIn = true;

                    localStorage.setItem('token', token);
                } catch {
                    state.error = 'Failed to decode token';
                    state.token = null;
                    state.user = null;
                    state.roles = [];
                    state.isLoggedIn = false;
                    localStorage.removeItem('token');
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state /* action */) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;