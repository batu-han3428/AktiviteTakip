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

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Login failed');
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

        // Claims keyleri (backend'den gelen full isimli claim key'ler)
        const nameIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
        const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
        const emailClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
        const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

        user = decoded[nameClaim] || decoded[emailClaim] || decoded[nameIdClaim] || null;

        // role claim tek mi dizi mi kontrol et
        const rawRole = decoded[roleClaim];
        if (Array.isArray(rawRole)) {
            roles = rawRole;
        } else if (typeof rawRole === 'string') {
            roles = [rawRole];
        } else {
            roles = [];
        }

        isLoggedIn = true;
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;

                const decoded = jwtDecode(action.payload);

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

                localStorage.setItem('token', action.payload);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state /*, action */) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
