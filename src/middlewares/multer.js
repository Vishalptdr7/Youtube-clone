// import multer from 'multer';
// import path from 'path';
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
    
//     cb(null,file.originalName);
//   },
// });

// export  const upload = multer({ storage: storage });





import multer from "multer";
import path from "path";
import fs from "fs";

// Define the upload directory
const uploadDir = "./public/temp";

// Ensure the directory exists, create it if it doesn't
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Use the defined upload directory
  },
  filename: function (req, file, cb) {
    // Correct the filename property to 'originalname'
    cb(null, file.originalname); // Use 'file.originalname' instead of 'file.originalName'
  },
});

// Initialize multer
export const upload = multer({ storage: storage });
