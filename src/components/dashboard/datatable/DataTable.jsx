import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/CloudDownload";
import "./DataTable.scss";

const DataTable = () => {
  const columns = [
    {
      field: "id",
      headerName: "S. No.",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "dashboardHeader ",
      cellClassName: "dashboardCell",
    },
    {
      field: "documentName",
      headerName: "Document name",
      flex: 2,
      align: "center",
      headerAlign: "center",
      headerClassName: "dashboardHeader",
      cellClassName: "dashboardCell",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 2,
      align: "center",
      headerAlign: "center",
      headerClassName: "dashboardHeader",
      cellClassName: "dashboardCell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      align: "center",
      headerAlign: "center",
      headerClassName: "dashboardHeader",
      cellClassName: "dashboardCell",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      align: "center",
      headerAlign: "center",
      headerClassName: "dashboardHeader",
      cellClassName: "dashboardCell",
      renderCell: (params) => (
        <Button
          //   variant="contained"
          color="primary"
          //   onClick={() => handleDownload(params.row.id)}
          onClick={() => alert(params.row.id)}
          style={{
            borderRadius: "10px",
            // padding: "8px", // Adjust padding as needed
            fontWeight: 300,
            boxSizing: "none",
            fontSize: "14px",
            lineHeight: "19px",
            letterSpacing: "-0.02em",
            fontFamily: "Inter",
          }}
        >
          <FileDownloadOutlinedIcon sx={{ pr: "10px" }} />
          Download
        </Button>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      documentName: "Document 1",
      category: "Category A",
      status: "Active",
      action: "Edit",
    },
    {
      id: 2,
      documentName: "Document 2",
      category: "Category B",
      status: "Inactive",
      action: "Delete",
    },
    {
      id: 3,
      documentName: "Document 3",
      category: "Category A",
      status: "Active",
      action: "View",
    },
    {
      id: 4,
      documentName: "Document 4",
      category: "Category C",
      status: "Active",
      action: "Edit",
    },
    {
      id: 5,
      documentName: "Document 5",
      category: "Category B",
      status: "Inactive",
      action: "Delete",
    },
    {
      id: 6,
      documentName: "Document 6",
      category: "Category A",
      status: "Active",
      action: "View",
    },
    {
      id: 7,
      documentName: "Document 7",
      category: "Category C",
      status: "Active",
      action: "Edit",
    },
    {
      id: 8,
      documentName: "Document 8",
      category: "Category B",
      status: "Inactive",
      action: "Delete",
    },
    {
      id: 9,
      documentName: "Document 9",
      category: "Category A",
      status: "Active",
      action: "View",
    },
    {
      id: 10,
      documentName: "Document 10",
      category: "Category C",
      status: "Active",
      action: "Edit",
    },
  ];

  //   const columns = [
  //     { field: "id", headerName: "S. No.", width: 90 },
  //     {
  //       field: "firstName",
  //       headerName: "Document name",
  //       width: 150,

  //     },
  //     {
  //       field: "firstName",
  //       headerName: "Category",
  //       width: 150,

  //     },
  //     {
  //       field: "firstName",
  //       headerName: "Satus",
  //       width: 150,

  //     },
  //     {
  //       field: "firstName",
  //       headerName: "Action",
  //       width: 150,

  //     },
  //     {
  //       field: "fullName",
  //       headerName: "Full name",
  //       description: "This column has a value getter and is not sortable.",
  //       sortable: false,
  //       width: 160,
  //       valueGetter: (params) =>
  //         `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  //     },
  //   ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        GridLinesVisibility="None"
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell": {
            fontWeight: 300,
            boxSizing: "none",
            fontSize: "14px",
            lineHeight: "19px",
            letterSpacing: "-0.02em",
            fontFamily: "Inter",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "18px",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "27px",
            letterSpacing: "-0.02em",
            fontFamily: "Inter",
          },
          "&>.MuiDataGrid-main": {
            "&>.MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid rgba(224, 224, 224, 1);",
            },
          },
          "&, [class^=MuiDataGrid]": { border: "none" },
          "& .MuiDataGrid-cell:focus": {
            outline: " none",
          },
        }}
      />
    </Box>
  );
};

export default DataTable;
