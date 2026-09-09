import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./LoginSlice";
import SingupSlice from "./SingUpSlice";
import userprofileslice from "./userprofileslice";

const store = configureStore({
  reducer: {
    login:  authSlice,
    signup: SingupSlice,
    userprofile:userprofileslice,
    userprofile: userprofileslice, // Add the user profile slice here
  },
});

export default store;