import React, { useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

const GroupTable = ({ groups, selectedRow, setSelectedRow, gridRef }) => {
    const columnDefs = useMemo(
        () => [{ headerName: "Grup Adý", field: "name", flex: 1, filter: "agTextColumnFilter" }],
        []
    );

    const defaultColDef = useMemo(
        () => ({
            flex: 1,
            minWidth: 120,
            sortable: true,
            filter: true,
            resizable: true,
        }),
        []
    );

    // Seçim deðiþtiðinde seçili satýrý dýþarý bildir
    const onSelectionChanged = () => {
        if (gridRef.current && gridRef.current.api) {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            setSelectedRow(selectedNodes.length > 0 ? selectedNodes[0].data : null);
        }
    };

    // selectedRow deðiþtiðinde grid'de seçili satýrý iþaretle
    useEffect(() => {
        if (gridRef.current?.api && selectedRow) {
            gridRef.current.api.forEachNode(node => {
                node.setSelected(node.data.id === selectedRow.id);
            });
        }
    }, [selectedRow, gridRef]);

    return (
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
                onSelectionChanged={onSelectionChanged}
                getRowId={params => params.data.id}
            />
        </div>
    );
};

export default GroupTable;
