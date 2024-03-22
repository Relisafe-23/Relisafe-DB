import mongoose from "mongoose";
const { connect } = mongoose;

import { config } from "dotenv";

config({
  path: "./.env",
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import app from "./app.js";

const database = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// Connect the database
connect(database, {
  // useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log("DB connection Successfully!");
});

// Start the server
const port = process.env.PORT || 5004;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

// Close the Server
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});
