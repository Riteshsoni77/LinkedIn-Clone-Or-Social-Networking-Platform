import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const loginuser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post('/login', {
                email: user.email,
                password: user.password,
            })
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({
                    message: "token not found"
                });
            }



        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }


    })

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/register',
                {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    username: user.username,
                }
            )
            if (response) {
                message: "Registration successful"

            }

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    })



export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get('/get_user_and_profile', {
                params: {
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)



export const getAllUser = createAsyncThunk(
    "user/getAllUser",

  async (_, thunkAPI) => {
    try {

      const response = await clientServer.get('/user/get_all_users');
      return thunkAPI.fulfillWithValue(response.data);
     

      
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  

})


export  const sendConnectionRequest= createAsyncThunk(
    "user/sendConnectionRequest",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/user/send/connection_request', {
                token: user.token,
                connectionId: user.user_id
            })

             thunkAPI.dispatch(getConnectionRequests({ token: user.token }));
            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getConnectionRequests= createAsyncThunk(
    "user/getConnectionRequests",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get('/user/getConnectionrequests', {
                params: {
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getMyConnectionRequests= createAsyncThunk(
    "user/getMyConnectionRequests",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get('/user/user_connection_request', {
                params: {
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


    export const acceptConnectionRequest= createAsyncThunk(
    "user/acceptConnectionRequest",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('user/accept_connection_request', {
                token: user.token,
                requestId: user.connectionId,
                action_type:user.action
            })
            thunkAPI.dispatch(getConnectionRequests({ token: user.token }));
            thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));
            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }   
)
