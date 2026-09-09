import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"login",
    initialState:{
        user:"",
        Password:"",
        userid:'',
    },
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setPassword:(state,action)=>{
            state.Password = action.payload;
        },
        setUserId:(state,action)=>{
            state.userid = action.payload;
        }
    }
});

export const { setUser, setPassword,setUserId } = authSlice.actions;
export default authSlice.reducer;
