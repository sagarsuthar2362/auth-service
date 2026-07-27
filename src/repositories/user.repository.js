import User from "../models/user.model.js";

export const findUserByUsernameOrEmail = async (username, email) => {
  return await User.findOne({
    $or: [{ username }, { email }],
  });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserById = async (userId) => {
  return await User.findById(userId);
};

export const updateRefreshToken = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, { refreshToken });
};
