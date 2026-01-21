import { config } from "dotenv";
config()

export default {
  PORT:3000,
  DB_URL: process.env.DB_URL,
  JWT_secret:process.env.JWT_SECRET,
  JWT_unverified_secret:process.env.JWT_UNVERIFIED_SECRET,
  MAIL_USER:process.env.MAIL_USER,
  MAIL_PASS:process.env.MAIL_PASS
};