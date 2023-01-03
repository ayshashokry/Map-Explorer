import { createSlice } from "@reduxjs/toolkit";
const LanguageSlice = createSlice({
  name: "lang",
  initialState: { language: 'ar' },
  reducers: {
    changeToArabic: (state, action) => {
      state.language = 'ar';
    }
    ,changeToEnglish: (state, action) => {
      state.language ='en'
    }
  
  },
});
export const { changeToArabic,changeToEnglish } = LanguageSlice.actions;
export default LanguageSlice.reducer;
