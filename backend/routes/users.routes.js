import {Router} from "express";
import { login, register,uploadprofilepicture,updateUserProfile,getUserAndProfile,
  updateProfileData, getAllUserProfile,downloadProfile} from "../controller/user.controler.js";

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

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update_profile_picture').post(upload.single('profile_picture'),uploadprofilepicture);
router.route('/user_update').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(  updateProfileData);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
// router.route('/user/send/connection_request')


export default router;