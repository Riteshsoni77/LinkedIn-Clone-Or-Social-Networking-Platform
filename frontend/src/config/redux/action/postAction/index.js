import { clientServer } from "@/config"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const getAllPosts=createAsyncThunk(
    "post/getAllPosts",

    async(_,thunkAPI)=>{
        try{

            const response= await clientServer.get('/get_all_posts')
             
            return thunkAPI.fulfillWithValue(response.data)
          

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }

    }

)


