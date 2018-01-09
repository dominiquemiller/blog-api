import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as cors from "cors";
import { routes } from "./routes";
import { strategy } from "./config/passport";

passport.use(strategy);

// Attach .env variables to process.env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  optionsSuccessStatus: 200
};

const db = mongoose.connect(process.env.MONGO_URI,  {useMongoClient: true}, err => {
  if (err) {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. Error:${err}`);
  }
  else {
    console.log("Connected to MongoDB");
  }
});

// set cors options
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json");
  next();
});

// initialize the routes
routes(app);

app.listen(port, () => {
  console.log(`Started server on port: ${port}`);
});

module.exports = app;