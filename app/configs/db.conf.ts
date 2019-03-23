import bluebird from "bluebird";
import mongoose from "mongoose";
import { MONGODB_URI } from "../constants/app.constants";

export const initDB = () => {
    // Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl,{ useNewUrlParser: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  console.log("MongoDB connection success"); },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

}