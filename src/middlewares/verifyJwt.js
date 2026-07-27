import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import * as userRepository from "../repositories/user.repository.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ApiError(401, "Access token is missing");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userRepository.findUserById(decoded._id);

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
