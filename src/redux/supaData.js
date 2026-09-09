import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  email: "",
  age: "",
  goal: "",
  gender: "Male",
  height: "",
  weight: "",
  targetWeight: "",
  activityLevel: "Moderately Active",
  diet: "No Preference",
};

const supaDataSlice = createSlice({
  name: "supaData",

  initialState,

  reducers: {
    setUserProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    updateField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },

    clearUserProfile: () => initialState,
  },
});

export const {
  setUserProfile,
  updateField,
  clearUserProfile,
} = supaDataSlice.actions;

export default supaDataSlice.reducer;