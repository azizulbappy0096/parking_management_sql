require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const db = require("./utils/db");
const { errorResponse } = require("./utils/response");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", require("./routes/user.route"));
app.use("/api/parking", require("./routes/parking.route"));
app.use("/api/slips", require("./routes/slip.route"));
app.use("/api/general", require("./routes/general.route"));

// catch and forward to error handler
app.use((err, req, res, next) => {
  console.error(err);
  errorResponse(
    res,
    err.message || "Unknown Error",
    err?.code || 500,
    err?.status || "INTERNAL_SERVER_ERROR",
    err?.details
  );
});

module.exports = app;
