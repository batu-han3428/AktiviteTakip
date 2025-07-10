import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const GroupFormDialog = ({ open, onClose, onSave, formData, setFormData, editingMode }) => {
    return (
        <Dialog open={open} onClose={onClose} disableRestoreFocus fullWidth maxWidth="sm">
            <DialogTitle>{editingMode ? "Grubu G�ncelle" : "Yeni Grup Ekle"}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Grup Ad�"
                    value={formData.name}
                    fullWidth
                    required
                    margin="normal"
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>�ptal</Button>
                <Button onClick={onSave} variant="contained" color="primary">
                    {editingMode ? "G�ncelle" : "Kaydet"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GroupFormDialog;
