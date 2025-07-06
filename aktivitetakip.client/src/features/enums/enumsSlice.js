import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchLocationsEnum = createAsyncThunk(
    'enums/fetchLocations',
    async () => {
        const response = await fetch(`${API_BASE_URL}/api/enum/locations`);
        return response.json();
    }
);

const enumsSlice = createSlice({
    name: 'enums',
    initialState: {
        locations: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocationsEnum.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLocationsEnum.fulfilled, (state, action) => {
                state.loading = false;
                state.locations = action.payload;
            })
            .addCase(fetchLocationsEnum.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default enumsSlice.reducer;
