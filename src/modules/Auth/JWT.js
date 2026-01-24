import jwt from 'jsonwebtoken';
import env from "../../config/env.js"

export const signAccessToken=(id)=>jwt.sign({sub:id}, env.JWT_secret)
export const verifyAccessToken=(token)=>jwt.verify(token, env.JWT_secret);

export const signVerifyToken=(id)=>jwt.sign({sub:id,scope:"unverified"}, env.JWT_unverified_secret,{ expiresIn: '10m' })
export const verfiyVerifyToken=(token)=>jwt.verify(token, env.JWT_unverified_secret);