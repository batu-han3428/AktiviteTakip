import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import {
    Button, FormControl, InputLabel, Select, MenuItem, Input, Chip, FormControlLabel, Switch
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../users/usersSlice';
import { fetchEvents, saveEvent } from '../events/eventsSlice';
import EventModal from './EventModal';

const CalendarPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.auth.user);
    const users = useSelector(state => state.users?.list || []);
    const events = useSelector(state => state.events.events);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentView, setCurrentView] = useState('timeGridWeek');
    const [isMonthlyView, setIsMonthlyView] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchEvents());
    }, [dispatch]);

    // Kaydetme / Güncelleme iþlemi için dispatch
    const addOrUpdateEvent = (eventData, isEditMode) => {
        dispatch(saveEvent({ eventData, isEditMode }));
    };

    // Takvimde tarih týklanýnca modal açýlýr, yeni etkinlik eklemek için
    const handleDateClick = (arg) => {
        setCurrentDate(arg.dateStr);
        setSelectedEvent(null);
        setIsEditing(false);
        setModalOpen(true);
    };

    // Takvimde var olan etkinlik týklanýnca modal açýlýr, düzenlemek için
    const handleEventClick = (arg) => {
        setCurrentDate(arg.event.startStr);
        setSelectedEvent({
            id: arg.event.id,
            title: arg.event.title,
            start: arg.event.start,
            end: arg.event.end,
            extendedProps: arg.event.extendedProps,
        });
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleSwitchChange = (e) => {
        const isMonth = e.target.checked;
        setIsMonthlyView(isMonth);
        setCurrentView(isMonth ? 'dayGridMonth' : 'timeGridWeek');
    };

    const handleUserSelectChange = (event) => {
        setSelectedUsers(event.target.value);
    };

    // Admin deðilse sadece kendi etkinlikleri gösterilir,
    // admin ise seçilen kullanýcýlarýn etkinlikleri veya tüm etkinlikler gösterilir
    const filteredEvents = user?.role === 'admin'
        ? (selectedUsers.length === 0
            ? events
            : events.filter(event => selectedUsers.includes(event.username)))
        : events.filter(event => event.username === user?.username);

    return (
        <div>
            {user?.role === 'admin' && (
                <>
                    <Button onClick={() => navigate('/reportpage')} sx={{ mr: 1 }}>
                        Raporlar
                    </Button>
                    <Button onClick={() => navigate('/rolespage')} sx={{ mr: 1 }}>
                        Rol
                    </Button>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Bir veya Daha Fazla Kullanýcý Seç</InputLabel>
                        <Select
                            multiple
                            value={selectedUsers}
                            onChange={handleUserSelectChange}
                            input={<Input />}
                            renderValue={(selected) => (
                                <div>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} sx={{ margin: 0.5 }} />
                                    ))}
                                </div>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: { maxHeight: 200 },
                                },
                            }}
                        >
                            {users.map((u) => (
                                <MenuItem key={u.username} value={u.username}>
                                    {u.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )}
            <FormControlLabel
                control={<Switch checked={isMonthlyView} onChange={handleSwitchChange} />}
                label={isMonthlyView ? "Aylýk Görünüm" : "Haftalýk Görünüm"}
            />

            <FullCalendar
                key={currentView} // görünüm deðiþtiðinde yeniden render için
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                initialView={currentView}
                weekends={false}
                editable={true}
                selectable={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={filteredEvents}
                eventResizableFromStart={true}
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                timeZone="UTC"
                locales={allLocales}
                locale="tr"
            />

            <EventModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={addOrUpdateEvent}
                currentDate={currentDate}
                selectedEvent={selectedEvent}
                isEditing={isEditing}
                user={user}
                users={users}
                isAdmin={user?.role === 'admin'}
            />
        </div>
    );
};

export default CalendarPage;

