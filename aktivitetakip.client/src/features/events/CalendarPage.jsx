import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import { Modal, Box, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Switch, Chip, Input } from '@mui/material';
//import { useAuth } from './AuthContext';
//import { useEvents } from './EventsContext';
import { useNavigate } from 'react-router-dom';
//import { useUsers } from './UsersContext';

const CalendarPage = () => {
    //const { user } = useAuth();
    const user = {};
    const navigate = useNavigate();
    //const { events, setEvents } = useEvents();
    //const { users, setUsers } = useUsers();
    //const [events, setEvents] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentView, setCurrentView] = useState('timeGridWeek');
    const [isMonthlyView, setIsMonthlyView] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const addOrUpdateEvent = (eventData, isEditMode) => {
        if (isEditMode) {
            //setEvents(prev =>
            //    prev.map((event) =>
            //        event.id === eventData.id ? { ...event, ...eventData } : event
            //    )
            //);
        } else {
            //setEvents(prev => [...prev, { ...eventData, username: user.username }]);
        }
    };

    const handleDateClick = (arg) => {
        setCurrentDate(arg.dateStr);
        setSelectedEvent(null);
        setIsEditing(false);
        setModalOpen(true);
    };

    const handleEventClick = (arg) => {
        setCurrentDate(arg.event.startStr);
        setSelectedEvent(arg.event);
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

    const filteredEvents = null;
    //    events.filter(event => {
    //    if (user.role === 'admin') {
    //        return selectedUsers.length === 0 || selectedUsers.includes(event.username);
    //    }
    //    return event.username === user.username;
    //});

    return (
        <div>
            {user.role === 'admin' && (
                <>
                    <Button onClick={() => navigate('/reportpage')}>Raporlar</Button>
                    <Button onClick={() => navigate('/rolespage')}>Rol</Button>
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
                            {/*{users.map((user) => (*/}
                            {/*    <MenuItem key={user.username} value={user.username}>*/}
                            {/*        {user.username}*/}
                            {/*    </MenuItem>*/}
                            {/*))}*/}
                        </Select>
                    </FormControl>
                </>
            )}
            <FormControlLabel
                control={<Switch checked={isMonthlyView} onChange={handleSwitchChange} />}
                label={isMonthlyView ? "Aylýk Görünüm" : "Haftalýk Görünüm"}
            />
            <FullCalendar
                key={currentView}
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                initialView={currentView}
                weekends={false}
                editable={true}
                selectable={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={filteredEvents}
                eventResizableFromStart={true}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
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
                //users={users}
                isAdmin={user.role === 'admin'}
            />
        </div>
    );
};

const EventModal = ({ isOpen, onClose, onSave, currentDate, selectedEvent, isEditing, user, users, isAdmin }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [firma, setFirma] = useState('');
    const [proje, setProje] = useState('');
    const [note, setNote] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedUsername, setSelectedUsername] = useState(user.username);
    const firmalar = ['Firma A', 'Firma B', 'Firma C'];
    const projelerMap = {
        'Firma A': ['Proje 1', 'Proje 2'],
        'Firma B': ['Proje B1'],
        'Firma C': []
    };

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title || '');
            setDescription(selectedEvent.extendedProps?.description || '');
            setCategory(selectedEvent.extendedProps?.category || '');
            setFirma(selectedEvent.extendedProps?.firma || '');
            setProje(selectedEvent.extendedProps?.proje || '');
            setNote(selectedEvent.extendedProps?.note || '');
            setLocation(selectedEvent.extendedProps?.location || '');
            const startDate = new Date(selectedEvent.start);
            const endDate = new Date(selectedEvent.end);
            setStartTime(startDate.toISOString().substring(11, 16));
            setEndTime(endDate.toISOString().substring(11, 16));
            setSelectedUsername(selectedEvent.extendedProps?.username || user.username);
        } else {
            setTitle('');
            setDescription('');
            setCategory('');
            setFirma('');
            setProje('');
            setNote('');
            setLocation('');
            setStartTime('');
            setEndTime('');
            setSelectedUsername(user.username);
        }
    }, [selectedEvent]);

    const handleSave = () => {
        if (!title || !description || !category || !startTime || !endTime) {
            alert('Lütfen tüm gerekli alanlarý doldurun.');
            return;
        }

        const currentDateOnly = currentDate.split('T')[0];
        const start = new Date(`${currentDateOnly}T${startTime}:00`);
        const end = new Date(`${currentDateOnly}T${endTime}:00`);

        if (isNaN(start) || isNaN(end)) {
            alert('Geçersiz tarih veya saat!');
            return;
        }

        const eventData = {
            id: selectedEvent ? selectedEvent.id : Date.now().toString(),
            title,
            start: new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString(),
            end: new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString(),
            description,
            category,
            firma,
            proje,
            note,
            location,
            username: selectedUsername
        };

        onSave(eventData, isEditing);
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setDescription('');
            setCategory('');
            setFirma('');
            setProje('');
            setNote('');
            setLocation('');
            setStartTime('');
            setEndTime('');
            setSelectedUsername(user.username);
        }
    }, [isOpen, user.username]);


    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    outline: 'none',
                    width: '90vw',
                    maxWidth: 800,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {isEditing ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}
                </Typography>

                {isAdmin && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Kullanýcý Seç</InputLabel>
                        <Select value={selectedUsername} onChange={(e) => setSelectedUsername(e.target.value)}>
                            {users.map((u) => (
                                <MenuItem key={u.username} value={u.username}>
                                    {u.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <TextField label="Baþlýk" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextField label="Etkinlik Detayý" fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Kategori</InputLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <MenuItem value="Toplantý">Toplantý</MenuItem>
                        <MenuItem value="Seminer">Seminer</MenuItem>
                        <MenuItem value="Eðitim">Eðitim</MenuItem>
                        <MenuItem value="Görev">Görev</MenuItem>
                        <MenuItem value="Diðer">Diðer</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Firma</InputLabel>
                    <Select value={firma} onChange={(e) => setFirma(e.target.value)}>
                        {firmalar.map((f) => (
                            <MenuItem key={f} value={f}>{f}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {firma && projelerMap[firma]?.length > 0 && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Proje</InputLabel>
                        <Select value={proje} onChange={(e) => setProje(e.target.value)}>
                            {projelerMap[firma].map((p) => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <TextField label="Not" fullWidth margin="normal" inputProps={{ maxLength: 50 }} value={note} onChange={(e) => setNote(e.target.value)} />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Yer</InputLabel>
                    <Select value={location} onChange={(e) => setLocation(e.target.value)}>
                        <MenuItem value="Onsite">Onsite</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Baþlangýç Saati" type="time" fullWidth margin="normal" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <TextField label="Bitiþ Saati" type="time" fullWidth margin="normal" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                        {isEditing ? 'Güncelle' : 'Kaydet'}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Kapat
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};


export default CalendarPage;