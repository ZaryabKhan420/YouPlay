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

  const existedser = User.findOne({ $or: [{ userName }, { email }] });
  if (existedser) {
    throw new ApiError(409, "User with email or userName already exists.");
  }

  // Check for avatar and cover image uploaded on server by multer
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // check kro k zror avatar hona chahiyee
  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar Image compulsory.");

    // upload on cloudinary
    const avatarResult = await uploadOnCloudinary(avatarLocalPath);
    const coverImageResult = await uploadOnCloudinary(coverImageLocalPath);

    // check kro sai sy avatar upload howa hai yah nahi
    if (!avatarResult) {
      throw new ApiError(409, "Avatar Image compulsory.");
    }

    // DB Entry
    const user = User.create({
      userName,
      avatar: avatarResult.url,
      coverImage: coverImage?.url || "",
      userName: userName.toLowerCase(),
    });
  }

  // Remove password and refreshToken from response object
  const createdUser = User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Error in user creation.");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, message: "User Registered Successfully."));

});
export { registerUser };
