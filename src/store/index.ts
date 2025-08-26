import { configureStore } from "@reduxjs/toolkit";
import clearanceReducer from "./clearanceSlice";

export const store = configureStore({
  reducer: {
    clearance: clearanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
