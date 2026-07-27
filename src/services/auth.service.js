import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const register = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    throw new Error("All fields are required");
  }

  // check if user exist
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log(existingUser);

  if (existingUser) {
    throw new Error("user already exists");
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
