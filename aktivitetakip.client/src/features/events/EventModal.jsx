import { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addOrUpdateEvent, closeModal } from './eventsSlice';

const EventModal = ({ isOpen, user, users }) => {
    const dispatch = useDispatch();
    const {
        currentDate,
        selectedEvent,
        isEditing,
    } = useSelector(state => state.events);  // Burada state.events olacak

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
            // Yeni etkinlik i�in alanlar� temizle
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

    useEffect(() => {
        if (!isOpen) {
            // Modal kapan�nca alanlar� temizle
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

    const handleSave = () => {
        if (!title || !description || !category || !startTime || !endTime) {
            alert('L�tfen t�m gerekli alanlar� doldurun.');
            return;
        }

        const currentDateOnly = currentDate.split('T')[0];
        const start = new Date(`${currentDateOnly}T${startTime}:00`);
        const end = new Date(`${currentDateOnly}T${endTime}:00`);

        if (isNaN(start) || isNaN(end)) {
            alert('Ge�ersiz tarih veya saat!');
            return;
        }

        const eventData = {
            id: selectedEvent ? selectedEvent.id : Date.now().toString(),
            title,
            start: new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString(),
            end: new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString(),
            extendedProps: {
                description,
                category,
                firma,
                proje,
                note,
                location,
                username: selectedUsername,
            },
            username: selectedUsername,
        };

        dispatch(addOrUpdateEvent({ eventData, isEditMode: isEditing }));
        dispatch(closeModal());
    };

    return (
        <Modal open={isOpen} onClose={() => dispatch(closeModal())}>
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
                    {isEditing ? 'Etkinlik D�zenle' : 'Yeni Etkinlik Ekle'}
                </Typography>

                {user.role === 'admin' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Kullan�c� Se�</InputLabel>
                        <Select value={selectedUsername} onChange={(e) => setSelectedUsername(e.target.value)}>
                            {users.map((u) => (
                                <MenuItem key={u.username} value={u.username}>
                                    {u.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <TextField label="Ba�l�k" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextField label="Etkinlik Detay�" fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Kategori</InputLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <MenuItem value="Toplant�">Toplant�</MenuItem>
                        <MenuItem value="Seminer">Seminer</MenuItem>
                        <MenuItem value="E�itim">E�itim</MenuItem>
                        <MenuItem value="G�rev">G�rev</MenuItem>
                        <MenuItem value="Di�er">Di�er</MenuItem>
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
                <TextField label="Ba�lang�� Saati" type="time" fullWidth margin="normal" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <TextField label="Biti� Saati" type="time" fullWidth margin="normal" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                        {isEditing ? 'G�ncelle' : 'Kaydet'}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => dispatch(closeModal())}>
                        Kapat
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EventModal;
