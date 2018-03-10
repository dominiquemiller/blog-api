import * as dotenv from "dotenv";

// Attach .env variables to process.env
dotenv.config();

const env = process.env.NODE_ENV;

export interface Config {
  development: Environment;
  test: Environment;
  production: Environment;
  [key: string]: Environment;
}

interface Environment {
  app: { port: string | number, mandrill: string, morgan: string };
  db: { name: string, connect: string };
  s3?: { accessKeyId: string, secretAccessKey: string, region: string, bucket: string };
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
 },
 s3: {
   accessKeyId: process.env.ACCESSKEY,
   secretAccessKey: process.env.SECRETKEY,
   region: process.env.REGION,
   bucket: process.env.DEV_BUCKET_NAME
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
  },
  s3: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: process.env.REGION,
    bucket: process.env.PROD_BUCKET_NAME
  }
};

export const config: Config = {
 development,
 test,
 production
};
