import React, { useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, updateUserActiveStatus } from "../../users/usersSlice";
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

const UsersGrid = () => {
    const dispatch = useDispatch();
    const { list: users, loading, error } = useSelector((state) => state.users);

    const gridRef = useRef();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const [columnDefs] = useState([
        {
            headerName: "Aktif",
            field: "isActive",
            pinned: "left",
            width: 100,
            cellRenderer: (params) => (
                <Switch
                    checked={params.value}
                    onChange={(event) => handleToggleClick(params.data, params.value, event)}
                    color="primary"
                />
            ),
            sortable: false,
            filter: false,
        },
        { headerName: "E-posta", field: "email", flex: 1, filter: "agTextColumnFilter" },
        { headerName: "Kullan�c� Ad�", field: "username", flex: 1, filter: "agTextColumnFilter" },
        { headerName: "Rol", field: "role", flex: 1, filter: true },
        { headerName: "Grup", field: "group", flex: 1, filter: true },
        {
            headerName: "Renk",
            field: "color",
            flex: 1,
            cellRenderer: (params) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        minHeight: "40px",
                    }}
                    title={params.value}
                >
                    <div
                        style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: params.value,
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>
            ),
            filter: false,
            sortable: false,
        },
        {
            headerName: "��lemler",
            pinned: "right",
            width: 120,
            cellRenderer: (params) => {
                const onEdit = () => {
                    console.log("Edit user", params.data.id);
                };
                const onDelete = () => {
                    console.log("Delete user", params.data.id);
                };
                return (
                    <>
                        <IconButton onClick={onEdit} size="small" color="primary" aria-label="D�zenle">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={onDelete} size="small" color="error" aria-label="Sil">
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            },
            sortable: false,
            filter: false,
        },
    ]);

    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 120,
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    const containerStyle = useMemo(() => ({
        width: "100%",
        height: "calc(100vh - 150px)",
        overflowX: "auto",
        overflowY: "hidden",
    }), []);

    const gridStyle = useMemo(() => ({
        width: "100%",
        height: "100%",
    }), []);

    const localeText = {
        page: "Sayfa",
        more: "Daha fazla",
        to: "ile",
        of: "aras�nda",
        next: "Sonraki",
        previous: "�nceki",
        equals: "E�ittir",
        notEqual: "E�it de�il",
        contains: "��erir",
        notContains: "��ermez",
    };

    const onBtnExport = () => {
        gridRef.current.api.exportDataAsCsv();
    };

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newActiveStatus, setNewActiveStatus] = useState(null);

    const handleToggleClick = (user, currentValue, event) => {
        event.target.blur();
        setSelectedUser(user);
        setNewActiveStatus(!currentValue);
        setConfirmDialogOpen(true);
    };

    const handleConfirm = () => {
        dispatch(updateUserActiveStatus({ id: selectedUser.id }))
            .then(() => {
                setConfirmDialogOpen(false);
                setSelectedUser(null);
                setNewActiveStatus(null);
                dispatch(fetchUsers());
            })
            .catch(() => {
                setConfirmDialogOpen(false);
            });
    };

    const handleCancel = () => {
        setConfirmDialogOpen(false);
        setSelectedUser(null);
        setNewActiveStatus(null);
    };

    // Kullan�c� Ekleme Dialog State'leri
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        username: "",
        role: "",
        group: "",
    });

    const handleAddOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddClose = () => {
        setAddDialogOpen(false);
        setNewUser({
            email: "",
            username: "",
            role: "",
            group: "",
        });
    };

    const handleAddUser = () => {
        console.log("Yeni kullan�c�:", newUser);
        // dispatch(createUser(newUser)).then(() => dispatch(fetchUsers()));
        handleAddClose();
    };

    if (loading) return <div>Y�kleniyor...</div>;
    if (error) return <div style={{ color: "red" }}>Hata: {error}</div>;

    return (
        <div>
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={onBtnExport}>Export CSV</button>
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
                        pagination={true}
                        paginationPageSize={20}
                        animateRows={true}
                        localeText={localeText}
                        suppressHorizontalScroll={false}
                        enableCellTextSelection={true}
                        domLayout="normal"
                        suppressColumnVirtualisation={true}
                    />
                </div>
            </div>

            {/* Aktif/Pasif onay dialogu */}
            <Dialog open={confirmDialogOpen} onClose={handleCancel}>
                <DialogTitle>Durumu De�i�tir</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <p>
                            Kullan�c� <b>{selectedUser.username}</b> i�in durumu{" "}
                            <b>{newActiveStatus ? "Aktif" : "Pasif"}</b> olarak de�i�tirmek istedi�inize emin misiniz?
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>�ptal</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Onayla
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Kullan�c� Ekle Dialog */}
            <Dialog open={addDialogOpen} onClose={handleAddClose}>
                <DialogTitle>Yeni Kullanici Ekle</DialogTitle>
                <DialogContent>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem", width: "400px" }}>
                        <TextField
                            label="E-posta"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <TextField
                            label="Kullan�c� Ad�"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <TextField
                            label="Rol"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        />
                        <TextField
                            label="Grup"
                            value={newUser.group}
                            onChange={(e) => setNewUser({ ...newUser, group: e.target.value })}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddClose}>�ptal</Button>
                    <Button onClick={handleAddUser} variant="contained" color="primary">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UsersGrid;
