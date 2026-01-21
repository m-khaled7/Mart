import nodemailer from "nodemailer"
import env from "./env.js";

export default nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
});
