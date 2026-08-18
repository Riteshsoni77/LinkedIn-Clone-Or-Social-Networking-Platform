import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUser, loginuser, registerUser } from "../../action/authAction";

const initialState = {
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:"",
    isTokenThere:false,
    profileFetched: false,
    connections: [],
    connnectionRequest: [],
    all_users: [],
    all_profiles_fetched: false,

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
        },
        setTokenThere:(state,action)=>{
            state.isTokenThere= true
        },
        setTokenNotThere:(state,action)=>{
            state.isTokenThere= false
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

            .addCase(getAllUser.pending,(state)=>{
                state.isLoading=true;
                state.message="Fetching all users data ....."
            } )

            .addCase(getAllUser.fulfilled,(state,action)=>{

                state.isLoading=false;
                state.all_profiles_fetched=true;
               
                state.isError=false;
               state.all_users=action.payload.profile;
            })

            .addCase(getAllUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
            })




        }
}
)
export const { reset,  emptymessage , setTokenThere, setTokenNotThere } = authSlice.actions;
export default authSlice.reducer