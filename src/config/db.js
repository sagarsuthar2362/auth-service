import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db succesfully: ", conn.connection.host);
  } catch (error) {
    console.error(`failed to connect to db: ${error.message}`);
    process.exit(1);
  }
};
