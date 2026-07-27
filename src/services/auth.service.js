import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import * as userRepository from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";

export const register = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user exist
  const existingUser = await userRepository.findUserByUsernameOrEmail(
    username,
    email,
  );

  if (existingUser) {
    throw new ApiError(409, "user already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  return await userRepository.createUser({
    name,
    username,
    email,
    password: hashedPassword,
  });
};

export const login = async ({ username, email, password }) => {
  // input validation
  if ((!username && !email) || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check user exists
  const user = await userRepository.findUserByUsernameOrEmail(username, email);

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // compare password
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

export const generateAccessAndRefreshToken = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  await userRepository.updateRefreshToken(userId, refreshToken);

  return { refreshToken, accessToken };
};

export const refreshTokens = async (token) => {
  if (!token) {
    throw new ApiError(401, "Refresh token is missing");
  }

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const user = await userRepository.findUserById(decoded._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (token !== user.refreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  return { refreshToken, accessToken };
};

export const logout = async (token) => {
  if (!token) {
    throw new ApiError(401, "Unauthorized access");
  }

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const user = await userRepository.findUserById(decoded._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized access");
  }

  await userRepository.removeRefreshToken(user._id);
};
