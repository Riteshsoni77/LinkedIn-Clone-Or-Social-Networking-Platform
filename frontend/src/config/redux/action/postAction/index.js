import { clientServer } from "@/config"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",

    async (_, thunkAPI) => {
        try {

            const response = await clientServer.get('/get_all_posts')

            return thunkAPI.fulfillWithValue(response.data)


        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }

    }

)


export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;

        try {

            const formData = new FormData();
            formData.append('token', localStorage.getItem("token"));
            formData.append('body', body);
            formData.append('media', file);

            const response = await clientServer.post('/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue(response.data);
            } else {
                return thunkAPI.rejectWithValue(response.data);
            }

        } catch (err) {
            return thunkAPI.rejectWithValue("post not uploaded");
        }
    }

)

export const deletePost= createAsyncThunk(
    "post/deletePost",

    async(postId,thunkAPI)=>{

        console.log("postId",postId);
       
        try{
            const response=await clientServer.delete('/delete_post',{
                data:{
                    token:localStorage.getItem("token"),
                    postId:postId
                }
            });

                return thunkAPI.fulfillWithValue(response.data);
           
        }catch (err){
            return thunkAPI.rejectWithValue("post not deleted");
        }
    }
)


 export const incrementPostLikes = createAsyncThunk(
    "post/incrementPostLikes",

    
    async( post, thunkAPI)=>{
        console.log("postId",post);
          
         try{
             const response= await clientServer.post ('/like_post',{
                    post_id:post.post_id,
                
             })
             return thunkAPI.fulfillWithValue(response.data);

         }catch( err){
             return thunkAPI.rejectWithValue(err.response.data.message);
         }
    }
)


// export const getAllComment= createAsyncThunk(
//     "post/getAllComments",
    
//      async(  postData, thunkAPI)=>{
//         try{

//         const  response= await clientServer.get('/get_comments',{
//             params:{
//                 postId:postData.post_id
//             }
//         })
//         return thunkAPI.fulfillWithValue({
//             comments:response.data,
//             postid:postData.post_id

//         });

//         }catch(err){
//             return thunkAPI.rejectWithValue(err.response.data.message);

//         }

//      }
// )

export const getAllComment = createAsyncThunk(
    "post/getAllComments",

    async (postData, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_comments", {
                params: {
                    postId: postData.post_id
                }
            });

            return thunkAPI.fulfillWithValue({
                comments: response.data.comments,
                postId: postData.post_id
            });

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);


export const postComment= createAsyncThunk(
    "post/postComment",
    async( commentData, thunkAPI)=>{
        try{
            console.log({
                postId:commentData.post_id,
                commentBody:commentData.body
            })
            const response= await clientServer.post('/comment',{

                token:localStorage.getItem("token"),
                postId:commentData.post_id,
                commentBody:commentData.body
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)




