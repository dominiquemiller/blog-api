import * as dotenv from "dotenv";

// Attach .env variables to process.env
dotenv.config();

const env = process.env.NODE_ENV;

interface Config {
  [key: string]: Environment;
}

interface Environment {
  app: { port: string | number, mandrill: string, morgan: string };
  db: { name: string, connect: string };
}


const development = {
 app: {
   port: parseInt(process.env.DEV_APP_PORT) || 3000,
   mandrill: process.env.MANDRILL_API,
   morgan: process.env.MORGAN_OUTPUT
 },
 db: {
   name: process.env.DEV_DB_NAME,
   connect: process.env.MONGO_URI
 }
};
const test = {
 app: {
   port: parseInt(process.env.TEST_APP_PORT) || 5000,
   mandrill: process.env.MANDRILL_API,
   morgan: process.env.MORGAN_OUTPUT
 },
 db: {
   name: process.env.TEST_DB_NAME,
   connect: process.env.MONGO_URI_TEST
 }
};
const production = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000,
    mandrill: process.env.MANDRILL_API,
    morgan: process.env.MORGAN_OUTPUT
  },
  db: {
    name: process.env.PROD_DB_NAME,
    connect: process.env.MONGO_URI
  }
};

export const config: Config = {
 development,
 test,
 production
};
