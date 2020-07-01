const fs = require("fs");
const path = require("path");

require("dotenv").config();

const expressApp = require("./expressApp");

process.on("SIGINT", () => {
  console.log("process exit on SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("process exit on SIGTERM");
  process.exit(1);
});

process.on("uncaughtException", error => {
  console.error("process exit on uncaughtException", error);
  process.exit(1);
});

process.on("exit", code => {
  console.log("process exit", code);
});

expressApp.listen(process.env.PORT, () => {
  console.log(`Loan server app running at PORT: ${process.env.PORT}`);
});
