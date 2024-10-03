import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "../components/home/imagesSlice";

export const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});
