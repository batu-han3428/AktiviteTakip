import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchUsers,
    updateUserActiveStatus,
    createUser,
    updateUser,
    deleteUser
} from "../../../users/usersSlice";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
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

import reactCSS from "reactcss";
import { useClickAway } from "react-use";

import {
    ModuleRegistry,
    ClientSideRowModelModule,
    TextFilterModule,
    ValidationModule,
    PaginationModule,
    LocaleModule,
    CsvExportModule,
    RowSelectionModule,
    RowStyleModule
} from "ag-grid-community";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    PaginationModule,
    LocaleModule,
    CsvExportModule,
    ValidationModule,
    RowSelectionModule,
    RowStyleModule
]);

const generatePassword = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const UsersGrid = () => {
    const dispatch = useDispatch();
    const { list: users, loading, error } = useSelector((state) => state.users);
    const { list: groups, loading: groupsLoading } = useSelector((state) => state.groups);
    const { list: roles, loading: rolesLoading } = useSelector((state) => state.roles);
    const gridRef = useRef();

    const [selectedRow, setSelectedRow] = useState(null);
    const [filterActiveOnly, setFilterActiveOnly] = useState(true);

    // Sadece kullanıcıları fetch eden useEffect, filterActiveOnly değiştiğinde çalışır
    useEffect(() => {
        dispatch(fetchUsers(filterActiveOnly));
    }, [dispatch, filterActiveOnly]);

    // Grupları ve rolleri sadece component mount olduğunda fetch eden useEffect
    useEffect(() => {
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
        groupId: "",
        color: "#000000",
        password: "",
        userDefinesPassword: false,
    });

    const sortedRoles = useMemo(() => {
        if (!roles) return [];
        // user rolünü başa al, diğerlerini sırala
        const userRole = roles.find(r => r.label.toLowerCase() === 'user');
        const otherRoles = roles.filter(r => r.label.toLowerCase() !== 'user');
        return userRole ? [userRole, ...otherRoles] : otherRoles;
    }, [roles]);

    const handleAddOpen = () => {
        setEditingMode(false);
        const userRole = sortedRoles.find(r => r.label.toLowerCase() === 'user');
        setUserForm({
            email: "",
            username: "",
            role: userRole ? userRole.id : "",
            groupId: "",
            color: "#000000",
            password: "",
            userDefinesPassword: false,
        });
        setUserModalOpen(true);
    };

    useEffect(() => {
        console.log('userForm.role:', userForm.role, typeof userForm.role);
    }, [userForm.role]);


    // Editing moda geçerken
  const handleEdit = () => {
  if (!selectedRow) return;
  const user = selectedRow;
  const roleId = Number(roles.find(r => r.id === user.role || r.label === user.role)?.id ?? "");
  const groupId = user.group?.id ?? "";

  setEditingMode(true);
  setUserForm({
    email: user.email,
    username: user.username,
    role: roleId,
    groupId: groupId,
    color: user.color,
    password: "",
    userDefinesPassword: false,
    id: user.id,
  });
  setUserModalOpen(true);
};


    const handleToggleClick = (user, currentValue, event) => {
        event.target.blur();
        setSelectedUser(user);
        setNewActiveStatus(!currentValue);
        setConfirmDialogOpen(true);
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

    const handleDelete = () => {
        if (!selectedRow) return;
        setSelectedUserForDelete(selectedRow);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedUserForDelete) return;
        dispatch(deleteUser(selectedUserForDelete.id)).then(() => {
            setDeleteDialogOpen(false);
            setSelectedRow(null);
            dispatch(fetchUsers(filterActiveOnly));
        });
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    const handleConfirm = () => {
        dispatch(updateUserActiveStatus({ id: selectedUser.id })).then(() => {
            setConfirmDialogOpen(false);
            dispatch(fetchUsers());
            setSelectedRow(null);
        });
    };

    const handleCancel = () => {
        setConfirmDialogOpen(false);
    };

    const handleGeneratePassword = () =>
        setUserForm((prev) => ({ ...prev, password: generatePassword() }));

    const handleSaveUser = () => {
        const { email, username, role, userDefinesPassword, password, color, groupId, id } = userForm;

        if (!email || !username || !role) {
            alert("E-posta, kullanıcı adı ve rol zorunludur!");
            return;
        }

        if (editingMode) {
            // Güncelleme modunda:
            // Şifre değişikliği checkbox işaretli değilse, şifreye dokunma
            // Eğer işaretliyse ve password boşsa, backend'e reset link için bilgi iletebiliriz (örn. password boş)
            // Eğer işaretli ve password doluysa, direkt şifreyi gönder

            // Burada payload'a şifreyi ancak userDefinesPassword ise ve password dolu ise ekle
            const payload = { email, username, role, groupId, color };


                // Şifre değiştirilecek
                if (password) {
                    payload.password = password; // direkt yeni şifre
                } else {
                    // password boşsa, backend reset link gönderir diye işaretleyebiliriz
                    // Mesela payload'a özel bir alan koyabiliriz:
                    payload.sendPasswordResetLink = true;
                }
            

            dispatch(updateUser({ id, ...payload })).then(() => dispatch(fetchUsers()));
        } else {
            // Yeni kullanıcı ekleme durumu
            if (!userDefinesPassword && !password) {
                alert("Şifre girilmeli veya 'şifreyi kullanıcı belirlesin' seçilmeli.");
                return;
            }

            const payload = { email, username, role, groupId, color };

            if (!userDefinesPassword && password) {
                payload.password = password;
            }

            dispatch(createUser(payload)).then(() => dispatch(fetchUsers()));
        }

        setUserModalOpen(false);
        setSelectedRow(null);
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
        { headerName: "Grup", field: "group", flex: 1, filter: true, valueGetter: (params) => params.data.group?.name || "" },
        {
            headerName: "Renk",
            field: "color",
            flex: 1,
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <div style={{
                        width: 24,
                        height: 24,
                        backgroundColor: params.value,
                        borderRadius: 4,
                        border: "1px solid #ccc"
                    }} />
                </div>
            ),
        },
    ], []);

    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 120,
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    const [showPassword, setShowPassword] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const popoverRef = useRef(null);
    useClickAway(popoverRef, () => setColorPickerOpen(false));

    const styles = reactCSS({
        default: {
            colorBox: {
                width: "36px",
                height: "20px",
                borderRadius: "4px",
                background: userForm.color,
                border: "1px solid #ccc",
                cursor: "pointer",
            },
            popover: { position: "absolute", zIndex: "999" },
        },
    });

    const filteredUsers = useMemo(() => {
        return filterActiveOnly ? users.filter((u) => u.isActive) : users;
    }, [users, filterActiveOnly]);



    const handleSelectionChanged = useCallback(() => {
        if (gridRef.current && gridRef.current.api) {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            setSelectedRow(selectedNodes.length > 0 ? selectedNodes[0].data : null);
        }
    }, []);

    const addButtonRef = useRef(null);
    const handleUserModalExited = () => {
        if (addButtonRef.current) {
            addButtonRef.current.focus();
        }
    };

    if (loading || groupsLoading || rolesLoading) return <div>Yükleniyor...</div>;
    if (error) return <div style={{ color: "red" }}>Hata: {error}</div>;

    return (
        <div>
            <div style={{ marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <Button variant="contained" color="primary" onClick={handleAddOpen}>+ Ekle</Button>
                <Button variant="contained" onClick={handleEdit} disabled={!selectedRow}>Güncelle</Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={!selectedRow}>Sil</Button>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filterActiveOnly}
                            onChange={(e) => setFilterActiveOnly(e.target.checked)}
                        />
                    }
                    label="Aktif kullanıcıları göster"
                />
                <Button variant="contained" onClick={() => gridRef.current.api.exportDataAsCsv()}>
                    CSV Export
                </Button>
            </div>

            <div style={{ width: "100%", height: "calc(100vh - 150px)" }} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={filteredUsers}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
                    paginationPageSize={20}
                    rowSelection={{
                        mode: "singleRow", checkboxes: false,
                        enableClickSelection: true, }}
                    onSelectionChanged={handleSelectionChanged}
                    getRowId={(params) => params.data.id}
                    getRowStyle={params => {
                        if (!params.data.isActive) {
                            return { backgroundColor: 'rgba(255, 0, 0, 0.1)' };
                        }
                        return null;
                    }}
                />
            </div>

            {/* delete dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} disableEnforceFocus disableRestoreFocus>
                <DialogTitle>Kullanıcıyı Sil</DialogTitle>
                <DialogContent>
                    {selectedUserForDelete && (
                        <p>
                            Kullanıcı <b>{selectedUserForDelete.username}</b> kalıcı olarak silinsin mi?
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>İptal</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error">Sil</Button>
                </DialogActions>
            </Dialog>


            {/* Confirm Dialog */}
            <Dialog open={confirmDialogOpen} onClose={handleCancel} disableEnforceFocus disableRestoreFocus>
                <DialogTitle>Durumu Değiştir</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <p>
                            Kullanıcı <b>{selectedUser.username}</b> için durumu{" "}
                            <b>{newActiveStatus ? "Aktif" : "Pasif"}</b> yapmak istediğinizden emin misiniz?
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>İptal</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">Onayla</Button>
                </DialogActions>
            </Dialog>

            {/* Kullanıcı Modal */}
            <Dialog open={userModalOpen} disableEnforceFocus disableRestoreFocus onClose={() => setUserModalOpen(false)} fullWidth maxWidth="md" TransitionProps={{ onExited: handleUserModalExited }}>
                <DialogTitle>{editingMode ? "Kullanıcıyı Güncelle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
                <DialogContent>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
                        <TextField label="E-posta" value={userForm.email} disabled={editingMode} fullWidth required
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                        <TextField label="Kullanıcı Adı" value={userForm.username} fullWidth required
                            onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} />
                        <TextField
                            select
                            label="Rol"
                            value={userForm.role ?? ""}
                            fullWidth
                            required
                            onChange={(e) => setUserForm({ ...userForm, role: Number(e.target.value) })}
                        >
                            {sortedRoles.map(r => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Grup"
                            value={userForm.groupId}
                            fullWidth
                            onChange={(e) => setUserForm({ ...userForm, groupId: e.target.value })}
                        >
                            {groups.map((g) => (
                                <MenuItem key={g.id} value={g.id}>
                                    {g.name}
                                </MenuItem>
                            ))}
                        </TextField>


                        <div style={{ gridColumn: "1 / span 2", position: "relative" }}>
                            <label>Renk</label>
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

                        <div style={{ gridColumn: "1 / span 2" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={userForm.userDefinesPassword}
                                        onChange={(e) =>
                                            setUserForm({
                                                ...userForm,
                                                userDefinesPassword: e.target.checked,
                                                password: "",
                                            })
                                        }
                                    />
                                }
                                label="Şifreyi kullanıcı belirlesin"
                            />
                            {!userForm.userDefinesPassword && (
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                                    <TextField
                                        label="Şifre"
                                        type={showPassword ? "text" : "password"}
                                        value={userForm.password}
                                        fullWidth
                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button onClick={handleGeneratePassword}>Şifre Oluştur</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUserModalOpen(false)}>İptal</Button>
                    <Button onClick={handleSaveUser} variant="contained" color="primary">
                        {editingMode ? "Güncelle" : "Kaydet"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UsersGrid;
