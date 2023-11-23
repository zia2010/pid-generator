import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "./Dashboard.scss";

export default function Dashboard() {
  return (
    <>
      <Grid
        container
        alignItems="flex-start"
        className="dashboardContentWrapper"
      >
        <Grid item container xs={6} className="dashboardLeftContent">
          <Grid item xs={12} className="dashboardLeftHeaderWrapper">
            {/* <Typography className="dashboardHeader fontFamilyPoppins fontWeight-500">
                Get Started Here
              </Typography>
              <Typography className="dashboardSubHeader fontFamilyInter fontWeight-300">
                Select the following tool to get started:
              </Typography> */}
          </Grid>
          <Grid item container spacing={4} className="alignCenter">
            <Grid item xs={4.6} className="itemBoxes">
              <Button
                variant="outlined"
                component={Link}
                to="/draftGenerator"
                className="itemTabs"
              >
                <ModeEditOutlineTwoToneIcon className="tabIcon" />
                <Typography
                  variant="h6"
                  className="tabHeading fontFamilyPoppins fontWeight-500"
                >
                  PID Generator
                </Typography>
                <Typography
                  variant="body1"
                  className="tabSubHeading fontFamilyInter fontWeight-300"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Fugiat laborum iste similique quasi, possimus quibusdam?
                </Typography>
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: "2rem"}}>
            <Grid item xs={12} className="dashboardLeftHeaderWrapper">
              <Typography className="dashboardHeader fontFamilyPoppins fontWeight-500">
                Dashboard
              </Typography>
              <Typography className="dashboardSubHeader fontFamilyInter fontWeight-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga,
                labore!
              </Typography>
            </Grid>
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

const columns = [
  { field: "id", headerName: "ID", width: 90 },

  {
    field: "docName",
    headerName: "Document Name",
    width: 150,
    editable: true,
  },
  {
    field: "summary",
    headerName: "Summary",
    width: 250,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, docName: "Snow", summary: "Jon", age: 35 },
  { id: 2, docName: "Lannister", summary: "Cersei", age: 42 },
  { id: 3, docName: "Lannister", summary: "Jaime", age: 45 },
  { id: 4, docName: "Stark", summary: "Arya", age: 16 },
  { id: 5, docName: "Targaryen", summary: "Daenerys", age: null },
  { id: 6, docName: "Melisandre", summary: null, age: 150 },
  { id: 7, docName: "Clifford", summary: "Ferrara", age: 44 },
  { id: 8, docName: "Frances", summary: "Rossini", age: 36 },
  { id: 9, docName: "Roxie", summary: "Harvey", age: 65 },
];
