/* eslint-disable import/no-anonymous-default-export */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loginReducer from "../components/login/loginSlice";
import testReducer from "../components/test";
import draftReducer from "../components/draftGenerator/draftGeneratorSlice";
import rephraserReducer from "../components/rephraser/rephraserSlice";
import spinnerReducer from "../components/Spinner/spinnerSlice";
import mainTabReducer from "../shared/elementLib/appBarSlice";
import notificationSlice from "../shared/compositeLib/notificationSlice";
const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  login: loginReducer,
  test: testReducer,
  draft: draftReducer,
  spinner: spinnerReducer,
  rephraser: rephraserReducer,
  mainTab: mainTabReducer,
  notificationReducer: notificationSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
// export default configureStore({
//   reducer: {
//     login: loginReducer,
//     test: testReducer
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
// });

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});
export default store;
