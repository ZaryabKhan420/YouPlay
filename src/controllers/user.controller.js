import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res, next) => {
  // Fetching Details
  const { userName, email, fullName, password } = req.body;

  // Validation
  if (
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are compulsory.");
  }

  // check if user already available

  const existedser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedser) {
    throw new ApiError(409, "User with email or userName already exists.");
  }

  // Check for avatar and cover image uploaded on server by multer
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // check kro k zror avatar hona chahiyee
  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar Image compulsory.");
  }

  if (!coverImageLocalPath) {
    throw new ApiError(409, "Cover Image compulsory.");
  }

  // upload on cloudinary
  const avatarResult = await uploadOnCloudinary(avatarLocalPath);
  const coverImageResult = await uploadOnCloudinary(coverImageLocalPath);

  // check kro sai sy avatar upload howa hai yah nahi
  if (!avatarResult) {
    throw new ApiError(409, "Avatar Image compulsory.");
  }

  if (!coverImageResult) {
    throw new ApiError(409, "Cover Image compulsory.");
  }

  // DB Entry
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatarResult.url,
    coverImage: coverImageResult.url,
    userName: userName.toLowerCase(),
  });

  // Remove password and refreshToken from response object
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Error in user creation.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully."));
});
export { registerUser };
