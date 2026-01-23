import bcrypt from "bcryptjs";
import crypto from "crypto";
import AppError from "../../utils/AppError.js";
import User from "../User/user.model.js";
import Hash from "../../utils/Hash.js";
import transporter from "../../config/email.js";
import verificationEmail from "../../templates/verificationEmail.js";

//send email verificatoin code
export const sendCodeService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  if(user.isVerified) throw new AppError("user already verified",400)
  const code = crypto.randomInt(100000, 999999).toString();
  user.verifyEmailCode = Hash(code);
  user.verifyEmailCodeExpiration = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    to: user.email,
    subject: "Verify your email",
    html: verificationEmail(code, user.name),
  });
};

//register
export const registerService = async (data) => {
  const userExsit = await User.findOne({ email: data.email });
  if (userExsit) throw new AppError("email already used", 400);
  const user = await User.create({ ...data });
  await sendCodeService(user._id);
  return user;
};

//login
export const loginService = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new AppError("user not found", 400);
  const correctPassword = await bcrypt.compare(data.password, user.password);
  if (!correctPassword) throw new AppError("incorrect login creidential", 400);
  if (!user.isVerified) sendCodeService(user._id);
  return user;
};

//verify email
export const verifyEmailService = async (userId, code) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  if (user.verifyEmailCode !== Hash(code))
    throw new AppError("Invalid verification code", 400);

  if (user.verifyEmailCodeExpiration < Date.now())
    throw new AppError("Verification code has expired", 400);

  user.isVerified = true;
  user.verifyEmailCode = undefined;
  user.verifyEmailCodeExpiration = undefined;
  await user.save();
};
