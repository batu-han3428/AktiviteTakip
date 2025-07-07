import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    const response = await fetch(`${API_BASE_URL}/api/group/getgroups`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Gruplar alýnamadý");
    const data = await response.json();
    return data.data;
});

const groupsSlice = createSlice({
    name: "groups",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default groupsSlice.reducer;
