import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Kullan�c�lar� getir
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (onlyActive = false, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    console.log(onlyActive)
    const response = await fetch(`${API_BASE_URL}/api/user/getusers?onlyActive=${onlyActive}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        let errorMessage = 'Kullan�c�lar al�namad�';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            throw new Error(errorMessage);
        }
        throw new Error(errorMessage);
    }
    return await response.json();
});

// Kullan�c� aktiflik durumu g�ncelle
export const updateUserActiveStatus = createAsyncThunk(
    'users/updateUserActiveStatus',
    async ({ id }, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state.auth.token;

        const response = await fetch(`${API_BASE_URL}/api/user/setactivestatus?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            let errorMessage = 'Kullan�c� durumu g�ncellenemedi';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                throw new Error(errorMessage);
            }
        }

        return await response.json();
    }
);

// Yeni kullan�c� olu�tur
export const createUser = createAsyncThunk('users/createUser', async (userData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    console.log(userData)
    const response = await fetch(`${API_BASE_URL}/api/user/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        let errorMessage = 'Kullan�c� olu�turulamad�';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            throw new Error(errorMessage);
        }
        throw new Error(errorMessage);
    }

    return await response.json();
});

// Var olan kullan�c�y� g�ncelle
export const updateUser = createAsyncThunk('users/updateUser', async (userData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    const response = await fetch(`${API_BASE_URL}/api/user/updateuser?id=${userData.id}`, { 
           method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        let errorMessage = 'Kullan�c� g�ncellenemedi';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            throw new Error(errorMessage);
        }
        throw new Error(errorMessage);
    }

    return await response.json();
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    const response = await fetch(`${API_BASE_URL}/api/user/deleteuser?userId=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let errorMessage = 'Kullan�c� silinemedi';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            throw new Error(errorMessage);
        }
        throw new Error(errorMessage);
    }

    return { id };
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        loading: false,
        error: null,
        updateLoading: false,
        updateError: null,
        createLoading: false,
        createError: null,
        onlyActive: true,
    },
    reducers: {
        setOnlyActive(state, action) {
            state.onlyActive = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUsers
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bilinmeyen bir hata olu�tu';
            })

            // updateUserActiveStatus
            .addCase(updateUserActiveStatus.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateUserActiveStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedUser = action.payload;
                const index = state.list.findIndex(user => user.id === updatedUser.id);
                if (index !== -1) {
                    state.list[index] = updatedUser;
                }
            })
            .addCase(updateUserActiveStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.error.message ?? 'Kullan�c� durumu g�ncellenemedi';
            })

            // createUser
            .addCase(createUser.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.createLoading = false;
                state.list.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.error.message ?? 'Kullan�c� olu�turulamad�';
            })

            // updateUser
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const index = state.list.findIndex(user => user.id === updatedUser.id);
                if (index !== -1) {
                    state.list[index] = updatedUser;
                }
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                const deletedId = action.payload.id;
                state.list = state.list.filter(user => user.id !== deletedId);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.error.message ?? 'Kullan�c� silinemedi';
            });
    },
});

export default usersSlice.reducer;
