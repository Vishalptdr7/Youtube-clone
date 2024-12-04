// import {Router} from 'express';

// // Import controllers
// import registerUser from '../controllers/user.js';

// import {upload} from '../middlewares/multer.js';

// // Routes
// const router=Router();

// // User registration route
// router.route('/register').post(upload.fields([{
//     name:'avtar',
//     maxCount:1
// },{
//     name:'coverImage',
//     maxCount:1
// }]),registerUser);


// export default router ;


import { Router } from "express";

// Import controllers
import {
  registerUser,
  verifyOtpAndCreateUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  currentUser,
  updateAccountDetails,
  updateCoverImage,
  updateUserAvtar,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";

// Routes
const router = Router();

// User registration route
router.route("/registerUser").post(
  upload.fields([
    {
      name: "avtar", // Note: check if you want to use 'avatar' instead of 'avtar'
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/verifyOtpAndCreateUser").post(verifyOtpAndCreateUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refreshAccessToken").post(refreshAccessToken);

router.route("/changeCurrentPassword").post(verifyJWT, changeCurrentPassword);

router.route("/currentUser").get(verifyJWT,currentUser);

router.route("/updateAccountDetails").patch(verifyJWT, updateAccountDetails);

router
  .route("/updateUserAvtar")
  .patch(verifyJWT, upload.single("avtar"), updateUserAvtar);

router
  .route("/updateCoverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

router.route("/c/:username").post(verifyJWT,getUserChannelProfile); // Add this route to get user's channel profile

router.route("/getWatchHistory").get(verifyJWT, getWatchHistory);




export default router;
