import {Router} from "express";

import multer from "multer";
import { commentPost, createPost, delete_comment_user, deletePost, get_connents_by_post, getAllPosts, increment_likes } from "../controller/posts.controller.js";
const router=Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage });

router.route("/post").post(upload.single('media'),createPost);
router.route("/get_all_posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_connents_by_post);
router.route("/delete_  comment").delete(delete_comment_user);
router.route("/like_post").post(increment_likes);




export default router;