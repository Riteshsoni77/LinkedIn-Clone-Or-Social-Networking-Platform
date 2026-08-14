import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, loginuser, registerUser } from "../../action/authAction";

const initialState = {
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:"",
    profileFetched: false,
    connections: [],
    connnectionRequest: [],

}


const authSlice = createSlice({
    
    name:"auth",
    initialState,
    reducers:{
        reset:()=> initialState,

        handleLoginUser:(state)=>{
            state.message="hellow"
        },
        emptymessage:(state)=>{
            state.message=""
        }
        

    },
        extraReducers:(builder)=>{
            builder
            .addCase(loginuser.pending,(state)=>{
                state.isLoading=true;
                state.message="Knocking the door ...";
            })
            .addCase(loginuser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true;
                state.isError=false;
                state.loggedIn=true;
                state.message="login is successfull";
               
            })

            .addCase(loginuser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;

            })

            .addCase( registerUser.pending,(state)=>{
                state.isLoading=true;
                state.message=" Registring you ....."
            })

            .addCase( registerUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true;
                state.isError=false;
                state.isLoggedIn=true;
                state.message="registration is successful please login to continue";
            })

            .addCase(registerUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload
 
            })


            .addCase(getAboutUser.pending,(state)=>{
                state.isLoading=true;
                state.message="Fetching your profile data ....."
            } )

            .addCase(getAboutUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true;
                state.isError=false;
                state.profileFetched=true;
                state.user=action.payload.profile;
                state.message="profile data fetched successfully";
                
            })

            .addCase(getAboutUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
            })
        }
}
)
export const { reset,  emptymessage } = authSlice.actions;
export default authSlice.reducer