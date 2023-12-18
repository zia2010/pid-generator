import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  alert: {
    type: 'info',
    message: '',
    timeout: 10000,
    showAlert: false,
  },
};
export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setErrorNotification: (state, action) => {
      state.alert.type = 'error';
      state.alert.message = action.payload?.message;
      state.alert.showAlert = true;
    },
    setSuccessNotification: (state, action) => {
      state.alert.type = 'success';
      state.alert.message = action.payload?.message;
      state.alert.showAlert = true;
    },
    resetNotification: () => {
      return initialState;
    },
  },
});

export const { setErrorNotification, setSuccessNotification, resetNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
