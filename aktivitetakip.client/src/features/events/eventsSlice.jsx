import { createSlice } from '@reduxjs/toolkit';

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


const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents(state, action) {
            state.events = action.payload;
        },
        addOrUpdateEvent(state, action) {
            const eventData = action.payload.eventData;
            const isEditMode = action.payload.isEditMode;
            if (isEditMode) {
                state.events = state.events.map((ev) =>
                    ev.id === eventData.id ? { ...ev, ...eventData } : ev
                );
            } else {
                state.events.push(eventData);
            }
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
    extraReducers: () => {
      
    },
});

export const {
    setEvents,
    addOrUpdateEvent,
    openModal,
    closeModal,
    setCurrentView,
    setIsMonthlyView,
    setSelectedUsers,
} = eventsSlice.actions;

export default eventsSlice.reducer;
