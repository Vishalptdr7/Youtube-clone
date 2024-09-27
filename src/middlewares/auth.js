import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

import { User } from "../models/user.js";
// const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");
//       console.log("Token:",req.cookies);
//     if (!token) {
//       throw new ApiError(400, "Invalid Token");
//     }
//     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodeToken?._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(401, "Invalid Access Token");
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     throw new ApiError(400,"User not find");

//   }
// });


 const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
      // Then they will get a new access token which will allow them to refresh the access token without logging out the user
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});







































//  const verifyJWT = asyncHandler(async (req, res, next) => {
//   const token =
//     req.cookies?.accessToken ||
//     req.header("Authorization")?.replace("Bearer ", "");
//     console.log("Cookies: ", req.cookies);

//     console.log(token);
//   if (!token) {
//     throw new ApiError(401, "Unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
//     );
//     if (!user) {
//       // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
//       // Then they will get a new access token which will allow them to refresh the access token without logging out the user
//       throw new ApiError(401, "Invalid access token");
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
//     // Then they will get a new access token which will allow them to refresh the access token without logging out the user
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// });

export  { verifyJWT };




