import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    const response = await fetch(`${API_BASE_URL}/api/user/getusers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        let errorMessage = 'Kullanýcýlar alýnamadý';
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
            body: JSON.stringify({ id: id }),
        });

        if (!response.ok) {
            let errorMessage = 'Kullanýcý durumu güncellenemedi';
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


const usersSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        loading: false,
        error: null,
        updateLoading: false,    // güncelleme yükleniyor durumu
        updateError: null,       // güncelleme hatasý
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
                state.error = action.error.message ?? 'Bilinmeyen bir hata oluþtu';
            })
            // updateUserActiveStatus için reducerlar
            .addCase(updateUserActiveStatus.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateUserActiveStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                // Eðer API güncellenmiþ kullanýcý dönerse, listede güncelle
                const updatedUser = action.payload;
                const index = state.list.findIndex(user => user.id === updatedUser.id);
                if (index !== -1) {
                    state.list[index] = updatedUser;
                }
            })
            .addCase(updateUserActiveStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.error.message ?? 'Kullanýcý durumu güncellenemedi';
            });
    },
});

export default usersSlice.reducer;
