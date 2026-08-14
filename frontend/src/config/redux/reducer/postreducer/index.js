import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from "../../action/postAction";

const initialState = {
    post: [],
    isError: false,
    postfetched: false,
    isLoading: false,
    message: "",
    comments: [],
    postid: "",
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
         reset:()=>initialState,
         resetpostid:(state)=>{
            state.postid=""
         },


    },
     extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching posts...";
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postfetched = true;
                state.isError = false;
                state.post = action.payload.posts;
               
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
})


export default postSlice.reducer;