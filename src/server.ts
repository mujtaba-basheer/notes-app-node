import { connect } from "mongoose";
import { config } from "dotenv";
import app from "./index";
config();

const MONGODB_URI = process.env.MONGODB_URI.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

connect(MONGODB_URI, { dbName: "notes-app" }).then(() =>
  console.log("DB connection successful!")
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
