import { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFirms } from '../firm/firmsSlice';
import { fetchCategories } from '../categories/categoriesSlice';

const EventModal = ({
    isOpen,
    onClose,
    onSave,
    currentDate,
    selectedEvent,
    isEditing,
    user,
    users,
    isAdmin,
}) => {
    const dispatch = useDispatch();

    const locations = useSelector((state) => state.enums.locations);

    // Redux store'dan veriler
    const firms = useSelector((state) => state.firm.list);
    const firmLoading = useSelector((state) => state.firm.loading);

    const categories = useSelector((state) => state.categories.list);
    const categoriesLoading = useSelector((state) => state.categories.loading);

    // Local state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [firma, setFirma] = useState('');
    const [proje, setProje] = useState('');
    const [note, setNote] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [selectedUsernames, setSelectedUsernames] = useState([user.username]);


    // Modal açýlýnca firmalarý ve kategorileri fetch et
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchFirms());
            dispatch(fetchCategories());
        }
    }, [isOpen, dispatch]);

    // Seçilen firmaya göre projeler
    const selectedFirm = firms.find((f) => f.id === firma);
    const projectsForSelectedFirm = selectedFirm ? selectedFirm.projects || [] : [];

    // selectedEvent varsa formu doldur
    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title || '');
            setDescription(selectedEvent.extendedProps?.description || '');
            setCategory(selectedEvent.extendedProps?.categoryId || '');
            setFirma(selectedEvent.extendedProps?.firma || '');
            setProje(selectedEvent.extendedProps?.proje || '');
            setNote(selectedEvent.extendedProps?.note || '');
            setLocation(selectedEvent.extendedProps?.location || '');
            const startDate = new Date(selectedEvent.start);
            const endDate = new Date(selectedEvent.end);
            setStartTime(startDate.toISOString().substring(11, 16));
            setEndTime(endDate.toISOString().substring(11, 16));
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
        }
    }, [selectedEvent, user.username]);

    // Modal kapandýðýnda formu sýfýrla
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
        }
    }, [isOpen, user.username]);

    // Kaydet fonksiyonu
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
            ...(selectedEvent && { id: selectedEvent.id }),
            title,
            startAt: new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString(),
            endAt: new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString(),
            description,
            categoryId: category,
            firmId: firma,
            projectId: proje,
            note,
            locationId: location,
            participants: selectedUsernames,
        };


        onSave(eventData, isEditing);
        onClose();
    };

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
                        <Select
                            multiple
                            value={selectedUsernames}
                            onChange={(e) => setSelectedUsernames(e.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {users.map((u) => (
                                <MenuItem key={u.username} value={u.username}>
                                    {u.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                )}

                <TextField
                    label="Baþlýk"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                    label="Etkinlik Detayý"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <FormControl fullWidth margin="normal" disabled={categoriesLoading}>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={firmLoading}>
                    <InputLabel>Firma</InputLabel>
                    <Select
                        value={firma}
                        onChange={(e) => setFirma(e.target.value)}
                    >
                        {firms.map((f) => (
                            <MenuItem key={f.id} value={f.id}>
                                {f.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {firma && (
                    <FormControl fullWidth margin="normal" disabled={firmLoading}>
                        <InputLabel>Proje</InputLabel>
                        <Select
                            value={proje}
                            onChange={(e) => setProje(e.target.value)}
                        >
                            {projectsForSelectedFirm.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <TextField
                    label="Not"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 50 }}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Yer</InputLabel>
                    <Select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        {locations.map((loc) => (
                            <MenuItem key={loc.id} value={loc.id}>
                                {loc.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                        label="Baþlangýç Saati"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                    />
                    <TextField
                        label="Bitiþ Saati"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                    <Button onClick={onClose} variant="outlined" color="error">
                        Ýptal
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Kaydet
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EventModal;
