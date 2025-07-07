import React, { useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, updateUserActiveStatus, createUser, updateUser } from "../../../users/usersSlice";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import { SketchPicker } from "react-color";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


import { fetchGroups } from "../groups/groupsSlice";
import { fetchRoles } from "../roles/rolesSlice";

import reactCSS from 'reactcss';
import { useClickAway } from 'react-use';

import {
    ModuleRegistry,
    ClientSideRowModelModule,
    TextFilterModule,
    ValidationModule,
    PaginationModule,
    LocaleModule,
    CsvExportModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    PaginationModule,
    LocaleModule,
    CsvExportModule,
    ValidationModule,
]);

const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const UsersGrid = () => {
    const dispatch = useDispatch();
    const { list: users, loading, error } = useSelector((state) => state.users);
    const { list: groups, loading: groupsLoading } = useSelector(state => state.groups);
    const { list: roles, loading: rolesLoading } = useSelector(state => state.roles);
    const gridRef = useRef();

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchGroups());
        dispatch(fetchRoles());
    }, [dispatch]);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newActiveStatus, setNewActiveStatus] = useState(null);
    const [editingMode, setEditingMode] = useState(false);

    const [userModalOpen, setUserModalOpen] = useState(false);
    const [userForm, setUserForm] = useState({
        email: "",
        username: "",
        role: "",
        group: "",
        color: "#000000",
        password: "",
        userDefinesPassword: false,
    });

    const handleToggleClick = (user, currentValue, event) => {
        event.target.blur();
        setSelectedUser(user);
        setNewActiveStatus(!currentValue);
        setConfirmDialogOpen(true);
    };

    const handleConfirm = () => {
        dispatch(updateUserActiveStatus({ id: selectedUser.id })).then(() => {
            setConfirmDialogOpen(false);
            dispatch(fetchUsers());
        });
    };

    const handleCancel = () => {
        setConfirmDialogOpen(false);
    };

    const handleAddOpen = () => {
        setEditingMode(false);
        setUserForm({
            email: "",
            username: "",
            role: "",
            group: "",
            color: "#000000",
            password: "",
            userDefinesPassword: false,
        });
        setUserModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingMode(true);
        setUserForm({
            email: user.email,
            username: user.username,
            role: user.role,
            group: user.group,
            color: user.color,
            password: "",
            userDefinesPassword: true,
            id: user.id,
        });
        setUserModalOpen(true);
    };

    const handleUserModalClose = () => setUserModalOpen(false);

    const handleGeneratePassword = () => setUserForm(prev => ({ ...prev, password: generatePassword() }));

    const handleSaveUser = () => {
        const { email, username, role, userDefinesPassword, password, color, group, id } = userForm;
        if (!email || !username || !role) {
            alert("E-posta, kullan c  ad , rol zorunlu!");
            return;
        }
        if (!userDefinesPassword && !password) {
            alert(" ifre girilmeli veya ' ifreyi kullan c  belirlesin' se ilmeli.");
            return;
        }
        const payload = { email, username, role, group, color };
        if (!userDefinesPassword) payload.password = password;

        if (editingMode) dispatch(updateUser({ id, ...payload })).then(() => dispatch(fetchUsers()));
        else dispatch(createUser(payload)).then(() => dispatch(fetchUsers()));

        handleUserModalClose();
    };

    const columnDefs = useMemo(() => [
        {
            headerName: "Aktif", field: "isActive", pinned: "left", width: 100,
            cellRenderer: params => (
                <Switch
                    checked={params.value}
                    onChange={(e) => handleToggleClick(params.data, params.value, e)}
                    color="primary"
                />
            ),
            sortable: false, filter: false,
        },
        { headerName: "E-posta", field: "email", flex: 1, filter: "agTextColumnFilter" },
        { headerName: "Kullanici Adi", field: "username", flex: 1, filter: "agTextColumnFilter" },
        { headerName: "Rol", field: "role", flex: 1, filter: true },
        { headerName: "Grup", field: "group", flex: 1, filter: true },
        {
            headerName: "Renk", field: "color", flex: 1, filter: false, sortable: false,
            cellRenderer: params => (
                <div style={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    height: "100%", minHeight: "40px"
                }}>
                    <div style={{
                        width: 24, height: 24, backgroundColor: params.value,
                        borderRadius: 4, border: "1px solid #ccc"
                    }} />
                </div>
            )
        },
        {
            headerName: "Islemler", pinned: "right", width: 120,
            cellRenderer: params => (
                <>
                    <IconButton onClick={() => handleEdit(params.data)} size="small" color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => console.log("delete", params.data)} size="small" color="error">
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
            sortable: false, filter: false,
        },
    ], []);

    const defaultColDef = useMemo(() => ({
        flex: 1, minWidth: 120, sortable: true, filter: true, resizable: true,
    }), []);

    const containerStyle = useMemo(() => ({
        width: "100%", height: "calc(100vh - 150px)", overflowX: "auto", overflowY: "hidden",
    }), []);
    const gridStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const localeText = {
        page: "Sayfa", more: "Daha fazla", to: "ile", of: "aras nda",
        next: "Sonraki", previous: " nceki",
        equals: "E ittir", notEqual: "E it de il", contains: "  erir", notContains: "  ermez",
    };

    const [showPassword, setShowPassword] = useState(false);




    // State ekle
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    // Ref
    const popoverRef = useRef(null);
    useClickAway(popoverRef, () => setColorPickerOpen(false));

    // Style
    const styles = reactCSS({
        'default': {
            colorBox: {
                width: '36px',
                height: '20px',
                borderRadius: '4px',
                background: userForm.color,
                border: '1px solid #ccc',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: '999',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });


    if (loading || groupsLoading || rolesLoading) return <div>Y kleniyor...</div>;
    if (error) return <div style={{ color: "red" }}>Hata: {error}</div>;

    return (
        <div>
            <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={() => gridRef.current.api.exportDataAsCsv()}>
                    Export CSV
                </Button>
                <Button variant="contained" color="primary" onClick={handleAddOpen}>
                    + Kullanici Ekle
                </Button>
            </div>
            <div style={containerStyle}>
                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={users}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination
                        paginationPageSize={20}
                        animateRows
                        localeText={localeText}
                        suppressHorizontalScroll={false}
                        enableCellTextSelection
                        domLayout="normal"
                        suppressColumnVirtualisation
                    />
                </div>
            </div>

            {/* Aktiflik Onay */}
            <Dialog open={confirmDialogOpen} onClose={handleCancel}>
                <DialogTitle>Durumu Degistir</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <p>
                            Kullanici <b>{selectedUser.username}</b> i in durumu{" "}
                            <b>{newActiveStatus ? "Aktif" : "Pasif"}</b> olarak de i tirmek istedi inize emin misiniz?
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}> ptal</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Onayla
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Kullan c  Modal */}
            <Dialog open={userModalOpen} onClose={handleUserModalClose} fullWidth maxWidth="md">
                <DialogTitle>{editingMode ? "Kullaniciyi G ncelle" : "Yeni Kullanici Ekle"}</DialogTitle>
                <DialogContent>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1.5rem",
                        marginTop: "1rem"
                    }}>
                        <TextField
                            label="E-posta"
                            value={userForm.email}
                            disabled={editingMode}
                            required
                            fullWidth
                            onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                        />
                        <TextField
                            label="Kullanici Adi"
                            value={userForm.username}
                            required
                            fullWidth
                            onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                        />
                        <TextField
                            select
                            label="Rol"
                            value={userForm.role}
                            required
                            fullWidth
                            onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                        >
                            {roles.map(r => <MenuItem key={r.id} value={r.id}>{r.label}</MenuItem>)}
                        </TextField>
                        <TextField
                            select
                            label="Grup"
                            value={userForm.group}
                            fullWidth
                            onChange={e => setUserForm({ ...userForm, group: e.target.value })}
                        >
                            {groups.map(g => <MenuItem key={g.id} value={g.name}>{g.name}</MenuItem>)}
                        </TextField>

                        {/* Renk Se ici */}
                        <div style={{ gridColumn: "1 / span 2", position: 'relative' }}>
                            <label style={{ marginBottom: "0.5rem", display: "block" }}>Renk</label>
                            <div style={styles.colorBox} onClick={() => setColorPickerOpen(true)} />

                            {colorPickerOpen && (
                                <div style={styles.popover} ref={popoverRef}>
                                    <SketchPicker
                                        color={userForm.color}
                                        onChangeComplete={(color) => setUserForm({ ...userForm, color: color.hex })}
                                    />
                                </div>
                            )}
                        </div>

                        {/*  ifre Alan  */}
                        <div style={{ gridColumn: "1 / span 2" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={userForm.userDefinesPassword}
                                        onChange={e => setUserForm({
                                            ...userForm,
                                            userDefinesPassword: e.target.checked,
                                            password: ""
                                        })}
                                    />
                                }
                                label="Sifreyi kullanici belirlesin"
                            />
                            {!userForm.userDefinesPassword && (
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                                    <TextField
                                        label="Sifre"
                                        type={showPassword ? "text" : "password"}
                                        value={userForm.password}
                                        fullWidth
                                        onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button onClick={handleGeneratePassword}>Sifre Olustur</Button>
                                </div>
                            )}
                        </div>

                     

                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleUserModalClose}>Iptal</Button>
                    <Button onClick={handleSaveUser} variant="contained" color="primary">
                        {editingMode ? "Guncelle" : "Kaydet"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UsersGrid;
