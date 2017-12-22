import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as cors from "cors";

// Attach .env variables to process.env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  optionsSuccessStatus: 200
};

// set cors options
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json");
  next();
});

app.listen(port, () => {
  console.log(`Started server on port: ${port}`);
});

module.exports = app;