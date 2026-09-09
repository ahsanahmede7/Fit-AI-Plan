import {createSlice} from "@reduxjs/toolkit";

const UserProfileSlice = createSlice({
    name :"userprofile",
    initialState:{
      id:"",
         fullName: "",
    email: "",
    age: "",
    goal: "",
    gender: "Male",
    height: "",
    weight: "",
    targetWeight: "",
    activityLevel: "Moderately Active",
    diet: "No Preference"},
    reducers:{
          updateField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },

    // baaki reducers...
  },
});

export const { updateField } = UserProfileSlice.actions;
export default UserProfileSlice.reducer;
