// src/features/project/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjects = createAsyncThunk('project/fetchProjects', async (firmaId) => {
    const response = await fetch(`/api/companies/${firmaId}/projects`);
    if (!response.ok) throw new Error('Projeler alýnamadý');
    return await response.json();
});

const projectSlice = createSlice({
    name: 'project',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearProjects(state) {
            state.list = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
