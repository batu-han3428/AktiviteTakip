import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Login & Register async thunk'larý (mevcut) ---

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

// --- Yeni eklenen: Reset token doðrulama thunk ---
export const verifyResetToken = createAsyncThunk(
    'auth/verifyResetToken',
    async ({ userId, token }, thunkAPI) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/auth/verify-reset-token?userId=${encodeURIComponent(
                    userId
                )}&token=${encodeURIComponent(token)}`
            );

            if (!res.ok) {
                const text = await res.text();
                return thunkAPI.rejectWithValue(text || 'Invalid or expired token');
            }

            return await res.json(); // Baþarýlýysa response gövdesi olabilir, ama öncelikle sadece baþarýlý olup olmadýðýný kontrol ediyoruz
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

// --- Yeni eklenen: Þifre sýfýrlama thunk ---
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ userId, token, newPassword }, thunkAPI) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                return thunkAPI.rejectWithValue(data.message || 'Password reset failed');
            }

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

// --- Token'dan kullanýcý bilgisi çýkarma fonksiyonu ---
const extractUserInfoFromToken = (token) => {
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

        // Token süresi kontrolü
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
            return { user: null, roles: [], isLoggedIn: false };
        }

        return { user, roles, isLoggedIn: true };
    } catch {
        return { user: null, roles: [], isLoggedIn: false };
    }
};

// --- Initial state hazýrlama ---
const savedToken = localStorage.getItem('token');
const { user, roles, isLoggedIn } = extractUserInfoFromToken(savedToken || '');

const initialState = {
    token: savedToken,
    user,
    roles,
    isLoggedIn,
    loading: false,
    error: null,

    // Reset password ile ilgili state'ler
    isResetTokenValid: null, // null=kontrol ediliyor, true/false=sonuç
    resetPasswordStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    resetPasswordError: null,
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
            state.isResetTokenValid = null;
            state.resetPasswordStatus = 'idle';
            state.resetPasswordError = null;
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
            // Login cases
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
                const { user, roles, isLoggedIn } = extractUserInfoFromToken(token);
                state.user = user;
                state.roles = roles;
                state.isLoggedIn = isLoggedIn;

                if (!isLoggedIn) {
                    state.error = 'Token expired or invalid';
                    state.token = null;
                    localStorage.removeItem('token');
                } else {
                    localStorage.setItem('token', token);
                    state.error = null;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register cases
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
            })

            // Reset token verification cases
            .addCase(verifyResetToken.pending, (state) => {
                state.isResetTokenValid = null;
                state.resetPasswordError = null;
            })
            .addCase(verifyResetToken.fulfilled, (state) => {
                state.isResetTokenValid = true;
            })
            .addCase(verifyResetToken.rejected, (state, action) => {
                state.isResetTokenValid = false;
                state.resetPasswordError = action.payload;
            })

            // Reset password cases
            .addCase(resetPassword.pending, (state) => {
                state.resetPasswordStatus = 'loading';
                state.resetPasswordError = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetPasswordStatus = 'succeeded';
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetPasswordStatus = 'failed';
                state.resetPasswordError = action.payload;
            });
    },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
