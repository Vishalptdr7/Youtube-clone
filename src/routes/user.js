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
import registerUser from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";

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

export default router;
