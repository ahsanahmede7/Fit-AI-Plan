import {createSlice} from "@reduxjs/toolkit";

const SingupSlice = createSlice({
    name :"signup",
    initialState:{
        user:"",
        Password:"",
        FullName:"",
    },
    reducers:{
        setsignupUser:(state,action)=>{
            state.user = action.payload;
        },
        setsignupPassword:(state,action)=>{
            state.Password = action.payload;},
        setFullName:(state,action)=>{
            state.FullName = action.payload;
        }
    }
});
export const { setsignupUser, setsignupPassword, setFullName } = SingupSlice.actions;
export default SingupSlice.reducer;
