import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const dbUrl = process.env.DB_URL || "";

const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("Already Connected");
  }
  if (connectionState === 2) {
    console.log("Connecting...");
  }

  try {
    await mongoose
      .connect(dbUrl!, { dbName: "plypicker", bufferCommands: false })
      .then((data) => {
        console.log(`Database connected with ${data.connection.host}`);
      });
  } catch (error: any) {
    console.log(error.message);
    // setTimeout(connectDB, 5000);
  }
};

export default connectDB;
