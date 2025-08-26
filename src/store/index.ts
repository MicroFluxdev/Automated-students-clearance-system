import { configureStore } from "@reduxjs/toolkit";
import clearanceReducer from "./clearanceSlice";
import studentReducer from "./studentSlice";

export const store = configureStore({
  reducer: {
    clearance: clearanceReducer,
    student: studentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
