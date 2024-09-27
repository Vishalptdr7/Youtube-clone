import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.js";
import { uploadfileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { verifyJWT } from "../middlewares/auth.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "User Not found!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message:"User registered successfully"
  // })
  ///get user details from frontend
  // validations if not empty
  //check if user is already registered ,using email,username
  //check for image,check for avatar
  //upload image

  const { email, username, password, fullname } = req.body;
  console.log("email:", email);
  if (fullname === "") {
    throw new ApiError(400, "Full Name is required");
  }

  if (email === "") {
    throw new ApiError(400, "Email is required");
  }
  if (username === "") {
    throw new ApiError(400, "Username is required");
  }
  if (password === "") {
    throw new ApiError(400, "Password is required");
  }

  const exist = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (exist) {
    throw new ApiError(400, "User already exists");
  }

  const avtarLocalPath = req.files?.avtar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avtar = await uploadfileOnCloudinary(avtarLocalPath);
  const coverImage = await uploadfileOnCloudinary(coverImageLocalPath);
  if (!avtar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullname,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong in server");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  /// req body ->data
  //username or email
  //find user
  //compare password
  //generate token
  //send token

  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError("Invalid credentials", 401);
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log(accessToken, refreshToken);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedUser,
        refreshToken,
        accessToken,
        message: "Logged in successfully",
      })
    );
});

// const logoutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         refreshToken: "",
//       },
//     },
//     { new: true }
//   );

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "User logged out"));
// });

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logoutUser };



