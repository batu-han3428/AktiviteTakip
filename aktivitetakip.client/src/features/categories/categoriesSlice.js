import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state.auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue('Token bulunamadý, lütfen giriþ yapýnýz.');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/category/getcategories`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Kategoriler alýnamadý: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            return data.data; // backend response yapýsýna göre data.data veya data olabilir
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Bilinmeyen bir hata oluþtu');
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default categoriesSlice.reducer;
