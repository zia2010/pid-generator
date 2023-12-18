import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  show: false,
};
export const spinnerSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showSpinner: (state) => {
      state.show = true;
    },
    hideSpinner: (state) => {
      state.show = false;
    },
  },
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;

export default spinnerSlice.reducer;
