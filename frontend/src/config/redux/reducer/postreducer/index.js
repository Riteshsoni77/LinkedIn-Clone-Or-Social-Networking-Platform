import { createSlice } from "@reduxjs/toolkit";
import { deletePost, getAllComment, getAllPosts, postComment } from "../../action/postAction";

const initialState = {
    posts: [],
    isError: false,
    postfetched: false,
    isLoading: false,
    message: "",
    comments: [],
    postId: "",
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
         reset:()=>initialState,
         resetPostid:(state)=>{
            state.postId= "";
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
                state.posts = action.payload.posts.reverse();
               
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })




            .addCase(deletePost.pending, (state) => {
                state.isLoading = true;
                state.message = "Deleting post...";
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postfetched = true;
                state.isError = false;
                state.posts = state.posts.filter(post => post._id !== action.payload.postId);
            })

            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            .addCase(getAllComment.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching comments...";
            })
            .addCase(getAllComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postfetched = true;
                state.isError = false;
                state.comments = action.payload.comments;
                state.postId = action.payload.postId;


            })

            .addCase(getAllComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(postComment.pending, (state) => {
                state.isLoading = true;
                state.message = "Posting comment...";
            })
            .addCase(postComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postfetched = true;
                state.isError = false;
                state.comments.push(action.payload.comment);
            })

            .addCase(postComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            

           
    }
})

 export const {resetPostid}=postSlice.actions;

export default postSlice.reducer;