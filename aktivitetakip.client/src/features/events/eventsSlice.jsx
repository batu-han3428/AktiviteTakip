import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        const response = await fetch(`${API_BASE_URL}/api/event/getevents`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Etkinlikler alýnamadý');

        const result = await response.json();

        if (!result.success) {
            return thunkAPI.rejectWithValue(result.message || 'Etkinlikler alýnamadý');
        }

        const events = result.data.map(ev => ({
            id: ev.id,              
            title: ev.title,
            start: ev.startAt,   
            end: ev.endAt,
            extendedProps: {
                description: ev.description,
                note: ev.note,
                categoryId: ev.categoryId,
                locationId: ev.locationId,
                projectId: ev.projectId,
                firmId: ev.firmId
            }
        }));

        return events;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const saveEvent = createAsyncThunk(
    'events/saveEvent',
    async ({ eventData, isEditMode }, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state.auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue('Token bulunamadý, lütfen giriþ yapýnýz.');
        }

        const selectedUsers = state.events.selectedUsers;

        const payload = {
            ...eventData,
            participants: selectedUsers,
        };

        try {
            const url = API_BASE_URL + (isEditMode ? `/api/event/updateevent/${eventData.id}` : '/api/event/createevent');
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Etkinlik kaydedilemedi');
            }

            const result = await response.json();

            if (!result.success) {
                return thunkAPI.rejectWithValue(result.message || 'Etkinlik kaydedilemedi');
            }

            const ev = result.data;
            return {
                id: ev.id,
                title: ev.title,
                start: ev.startAt,
                end: ev.endAt,
                extendedProps: {
                    description: ev.description,
                    note: ev.note,
                    categoryId: ev.categoryId,
                    locationId: ev.locationId,
                    projectId: ev.projectId,
                    firmId: ev.firmId,
                }
            };

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Initial State
const initialState = {
    events: [],
    selectedEvent: null,
    modalOpen: false,
    currentDate: null,
    isEditing: false,
    currentView: 'timeGridWeek',
    isMonthlyView: false,
    selectedUsers: [],
    loading: false,
    error: null,
};

// Slice
const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents(state, action) {
            state.events = action.payload;
        },
        openModal(state, action) {
            state.modalOpen = true;
            state.currentDate = action.payload?.currentDate || null;
            state.selectedEvent = action.payload?.selectedEvent || null;
            state.isEditing = action.payload?.isEditing || false;
        },
        closeModal(state) {
            state.modalOpen = false;
            state.selectedEvent = null;
            state.isEditing = false;
            state.currentDate = null;
        },
        setCurrentView(state, action) {
            state.currentView = action.payload;
        },
        setIsMonthlyView(state, action) {
            state.isMonthlyView = action.payload;
        },
        setSelectedUsers(state, action) {
            state.selectedUsers = action.payload;
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(saveEvent.fulfilled, (state, action) => {
                const updatedEvent = action.payload;
                const index = state.events.findIndex(ev => ev.id === updatedEvent.id);
                if (index !== -1) {
                    state.events[index] = updatedEvent;
                } else {
                    state.events.push(updatedEvent);
                }
            })
            .addCase(saveEvent.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            });
    },
});

// Exports
export const {
    setEvents,
    openModal,
    closeModal,
    setCurrentView,
    setIsMonthlyView,
    setSelectedUsers,
    clearError
} = eventsSlice.actions;

export default eventsSlice.reducer;
