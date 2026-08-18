import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/config/redux/reducer/authreducer"; 
import postReducer from "./reducer/postreducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    postReducer: postReducer,
  },
});

