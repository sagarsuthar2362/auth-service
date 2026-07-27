import * as authService from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// options for cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, user, "user created successfully"));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);

    const { accessToken, refreshToken } =
      await authService.generateAccessAndRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user logged in successfully"));
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    const { refreshToken, accessToken } =
      await authService.refreshTokens(token);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tokens refreshed successfully"));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    await authService.logout(token);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "user logged out successfully"));
  } catch (error) {
    next(error);
  }
};
