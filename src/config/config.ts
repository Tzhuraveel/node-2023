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
};
