import { configureStore } from "@reduxjs/toolkit";
import clearanceReducer from "./slices/clearingOfficer/clearanceSlice";
import studentReducer from "./slices/clearingOfficer/studentSlice";

export const store = configureStore({
  reducer: {
    clearance: clearanceReducer,
    student: studentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // allow function storage in confirmDialog
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
