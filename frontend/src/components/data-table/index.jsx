
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as React from 'react';
const IGridToolbar = () => {
    return <GridToolbar csvOptions={{
        fileName: 'out',
        delimiter: ',',
        utf8WithBom: true
    }} />
}
export const DataTable = (props) => {
    const { rows, columns, style, darkMode } = props;
    const switchColor = darkMode ? '#ccc' : 'var(--black)'
    return (
        rows && <div style={{ ...style }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                disableSelectAllCheckbox
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 200}
                components={{ Toolbar: IGridToolbar }}
                sx={{
                    fontSize: '14px',
                    color: '#fff',
                    '& .MuiButton-textSizeSmall': {
                        color: darkMode ? '#ccc' : '#1976d2',
                        fontSize: '14px',
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: darkMode ? '#1d1f21' : "#e8f0fe"
                    },
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                        py: 1,
                    },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                        py: '16px',
                    },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                        py: '22px',
                    },
                    '& .MuiTablePagination-displayedRows': {
                        color: switchColor
                    },
                }}
            />
        </div>
    );
}
export default DataTable;
