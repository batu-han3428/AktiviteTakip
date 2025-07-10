import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all groups
export const fetchGroups = createAsyncThunk(
    "groups/fetchGroups",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await fetch(`${API_BASE_URL}/api/group/getgroups`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || "Gruplar alýnamadý");
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || "Gruplar alýnamadý");
        }
    }
);

// Create a new group
export const createGroup = createAsyncThunk(
    "groups/createGroup",
    async (groupData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await fetch(`${API_BASE_URL}/api/group/creategroup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(groupData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || "Grup oluþturulamadý");
            }
            const data = await response.json();
            return data.data; // Yeni oluþturulan grup bilgisi
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || "Grup oluþturulamadý");
        }
    }
);

// Update an existing group
export const updateGroup = createAsyncThunk(
    "groups/updateGroup",
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await fetch(`${API_BASE_URL}/api/group/updategroup`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || "Grup güncellenemedi");
            }

            const responseData = await response.json();
            console.log("updateGroup API response:", responseData);
            return responseData; 
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || "Grup güncellenemedi");
        }
    }
);


// Delete a group
export const deleteGroup = createAsyncThunk(
    "groups/deleteGroup",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await fetch(`${API_BASE_URL}/api/group/deletegroup/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || "Grup silinemedi");
            }
            // Genellikle silme iþleminde data dönmeyebilir
            return id; // Silinen grup id'si ile store'da listeden çýkarabilirsin
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || "Grup silinemedi");
        }
    }
);

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
            // Fetch groups
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Create group
            .addCase(createGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Update group
            .addCase(updateGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(group => group.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Delete group
            .addCase(deleteGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(group => group.id !== action.payload);
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default groupsSlice.reducer;
