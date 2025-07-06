import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchFirms = createAsyncThunk(
    'firm/fetchFirms',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state.auth.token;

        console.log('API �a�r�s� i�in token:', token);

        if (!token) {
            return thunkAPI.rejectWithValue('Token bulunamad�, l�tfen giri� yap�n�z.');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/firm/getfirmsprojects`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Firmalar al�namad�: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Bilinmeyen bir hata olu�tu');
        }
    }
);


const firmSlice = createSlice({
    name: 'firm',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFirms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFirms.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchFirms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default firmSlice.reducer;
