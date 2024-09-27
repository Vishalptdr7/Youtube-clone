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
import {loginUser, registerUser,logoutUser} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";

// Routes
const router = Router();

// User registration route
router.route("/register").post(
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

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,logoutUser);

export default router;
