import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/config/redux/reducer/authreducer"; // default reducer export

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

