import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  mainTabValue: 0,
};
export const mainTabSlice = createSlice({
  name: "tabValue",
  initialState,
  reducers: {
    setMainTabValue: (state, action) => {
      state.mainTabValue = action.payload;
    },
    resetTabValue: () => initialState,
  },
});

export const { setMainTabValue, resetTabValue } = mainTabSlice.actions;

export default mainTabSlice.reducer;
