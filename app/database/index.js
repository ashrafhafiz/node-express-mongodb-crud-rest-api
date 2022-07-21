// external imports
import "dotenv/config";
import mongoose from "mongoose";

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB Server!");
  } catch (error) {
    console.log("Unable to connect to MongoDB Server!");
    console.error(error);
  }
}

module.exports = dbConnect;
