import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

const port = process.env.PORT || 8000;

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR : ", error);
    });
    app.listen(port, () => {
      console.log(`Server at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!! ", err);
  });
