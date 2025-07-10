import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup
} from "./groupsSlice";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

const GroupsPage = () => {
    const dispatch = useDispatch();
    const { list: groups, loading, error } = useSelector(state => state.groups);
    const gridRef = useRef();
    const openButtonRef = useRef(null);

    const [selectedRow, setSelectedRow] = useState(null);
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [editingMode, setEditingMode] = useState(false);
    const [groupForm, setGroupForm] = useState({
        name: "",
    });

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handleAddOpen = () => {
        setEditingMode(false);
        setGroupForm({ name: "" });
        setGroupModalOpen(true);
    };

    const handleCloseModal = () => {
        setGroupModalOpen(false);
        if (openButtonRef.current) {
            openButtonRef.current.focus();
        }
    };

    const handleEdit = () => {
        if (!selectedRow) return;
        setEditingMode(true);
        setGroupForm({
            name: selectedRow.name,
            id: selectedRow.id,
        });
        setGroupModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedRow) return;
        if (window.confirm(`"${selectedRow.name}" grubunu silmek istediğinize emin misiniz?`)) {
            dispatch(deleteGroup(selectedRow.id)).then(() => {
                setSelectedRow(null);
                dispatch(fetchGroups());
            });
        }
    };

    const handleSaveGroup = () => {
        if (!groupForm.name.trim()) {
            alert("Grup adı zorunludur.");
            return;
        }

        if (editingMode) {
            dispatch(updateGroup(groupForm)).then(() => {
                setGroupModalOpen(false);
                setSelectedRow(null);
            });
        } else {
            dispatch(createGroup(groupForm)).then(() => {
                setGroupModalOpen(false);
                dispatch(fetchGroups());
            });
        }
    };

    const columnDefs = useMemo(() => [
        { headerName: "Grup Adı", field: "name", flex: 1, filter: "agTextColumnFilter" },
    ], []);

    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 120,
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    const handleSelectionChanged = useCallback(() => {
        if (gridRef.current && gridRef.current.api) {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            setSelectedRow(selectedNodes.length > 0 ? selectedNodes[0].data : null);
        }
    }, []);

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div style={{ color: "red" }}>Hata: {error}</div>;

    return (
        <div>
            <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
                <Button ref={openButtonRef} variant="contained" color="primary" onClick={handleAddOpen}>+ Ekle</Button>
                <Button variant="contained" onClick={handleEdit} disabled={!selectedRow}>Güncelle</Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={!selectedRow}>Sil</Button>
            </div>

            <div style={{ width: "100%", height: "calc(100vh - 150px)" }} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={groups}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
                    paginationPageSize={20}
                    rowSelection={{
                        mode: "singleRow", checkboxes: false,
                        enableClickSelection: true,
                    }}
                    onSelectionChanged={handleSelectionChanged}
                    getRowId={params => params.data.id}
                />
            </div>

            <Dialog open={groupModalOpen} onClose={handleCloseModal} disableRestoreFocus fullWidth maxWidth="sm">
                <DialogTitle>{editingMode ? "Grubu Güncelle" : "Yeni Grup Ekle"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Grup Adı"
                        value={groupForm.name}
                        fullWidth
                        required
                        margin="normal"
                        onChange={e => setGroupForm({ ...groupForm, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setGroupModalOpen(false)}>İptal</Button>
                    <Button onClick={handleSaveGroup} variant="contained" color="primary">
                        {editingMode ? "Güncelle" : "Kaydet"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default GroupsPage;
