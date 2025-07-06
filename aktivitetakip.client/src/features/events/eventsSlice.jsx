import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
    const response = await fetch('/api/events');
    if (!response.ok) throw new Error('Etkinlikler alýnamadý');
    return await response.json();
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

        console.log(payload)

        const url = API_BASE_URL + (isEditMode ? `/api/events/${eventData.id}` : '/api/event/createevent');
        const method = isEditMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Etkinlik kaydedilemedi');
        return await response.json();
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
            state.currentDate = action.payload.currentDate || null;
            state.selectedEvent = action.payload.selectedEvent || null;
            state.isEditing = action.payload.isEditing || false;
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
                state.error = action.error.message;
            })
            .addCase(saveEvent.fulfilled, (state, action) => {
                const updatedEvent = action.payload;
                const index = state.events.findIndex((ev) => ev.id === updatedEvent.id);
                if (index !== -1) {
                    state.events[index] = updatedEvent;
                } else {
                    state.events.push(updatedEvent);
                }
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
} = eventsSlice.actions;

export default eventsSlice.reducer;
