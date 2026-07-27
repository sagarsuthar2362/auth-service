import * as authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

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

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user logged in successfully"));
  } catch (error) {
    next(error);
  }
};
