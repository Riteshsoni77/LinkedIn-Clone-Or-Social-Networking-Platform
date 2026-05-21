import {Router} from "express";
import { login, register,uploadprofilepicture } from "../controller/user.controler.js";

import multer from "multer";
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

router.route("/update_profile_picture").post(upload.single('profile_picture'),uploadprofilepicture)
router.route('/register').post(register);
router.route('/login').post(login);


export default router;