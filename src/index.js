import { connectDB } from "./db/index.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

const app = express();

app.use(express.json());

/* Second Approach */
connectDB();

/* First Approach
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
    app.on("error", (error) => {
      console.log(
        "Error during connecting Database to Backend application",
        error
      );
    });

    app.listen(process.env.PORT, () => {
      console.log(`App Started on Port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error during Database Connectivity", error);
  }
})();
*/
