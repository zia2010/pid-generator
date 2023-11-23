import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import NotificationProvider from "./shared/compositeLib/Notification/NotificationProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
const persistor = persistStore(store);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <NotificationProvider>
      <PersistGate loading={null} persistor={persistor}>
          <App />
      </PersistGate>
      </NotificationProvider>
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
