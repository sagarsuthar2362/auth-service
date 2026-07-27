import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { use } from "bcrypt/promises.js";

export const register = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user exist
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log(existingUser);

  if (existingUser) {
    throw new ApiError(409, "user already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  // return created user
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

export const login = async ({ username, email, password }) => {
  // input validation
  if ((!username && !email) || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check user exists
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // compare password
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};
