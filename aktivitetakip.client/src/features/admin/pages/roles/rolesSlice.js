import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    const response = await fetch(`${API_BASE_URL}/api/enum/roles`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Roller alýnamadý");
    return await response.json();
});

const rolesSlice = createSlice({
    name: "roles",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Gerekirse burada role ekleme/güncelleme/silme iþlemleri de yapýlabilir.
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default rolesSlice.reducer;
