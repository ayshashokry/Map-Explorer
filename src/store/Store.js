import { configureStore } from "@reduxjs/toolkit";
import LanguageSlice from "./reducers/LanguageSlice";
const store = configureStore({
  reducer: {
  
    lang: LanguageSlice,
  },
});
export default store;
