import { config } from "dotenv";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,

  ACCESS_SECRET: process.env.ACCESS,
  REFRESH_SECRET: process.env.REFRESH,
  ACTIVATE_SECRET: process.env.ACTIVATE,
  ACTION_SECRET: process.env.ACTION,

  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  FRONT_URL: process.env.FRONT_URL,

  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_BUCKET_URL: process.env.AWS_S3_BUCKET_URL,
  AWS_S3_ACL: process.env.AWS_S3_ACL,
};
