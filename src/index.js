import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

/* Second Approach */
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(
        "Error during connecting Database to Backend application",
        error
      );
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log("App Started");
    });
  })
  .catch((error) => console.log("MongoDB Connection Failed", error));

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
