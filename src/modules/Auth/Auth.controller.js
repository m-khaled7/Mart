import AsyncHandler from "../../utils/AsyncHandler.js"
import validator from "../../utils/validator.js"
import { registerSchema,loginSchema } from "./validations.Schema.js"
import { loginService, registerService, sendCodeService, verifyEmailService } from "./Auth.service.js"
import ApiResponse from "../../utils/ApiResponse.js"
import AppError from "../../utils/AppError.js"
import { signVerifyToken,signAccessToken } from "../../utils/JWT.js"

//register
export const register = AsyncHandler(async (req, res) => {
    const { name, email, password, confirm_password } = req.body
    const validData = validator(registerSchema, { name, email, password, confirm_password })
    const user = await registerService(validData)
    const token = signVerifyToken(user._id)
    res.status(201).json(ApiResponse("user created",token))
})

//login
export const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body
    const validData = validator(loginSchema, { email, password })
    const user = await loginService(validData)

    // retrun temporary 10m token for unverified user
    if(!user.isVerified){
        const token = signVerifyToken(user._id)
        return res.status(200).json(ApiResponse("email is unverified",token))
    } 

    //return access token if user verified
    const token = signAccessToken(user._id) ;
    res.status(200).json(ApiResponse( "successfull login",token))
})

//verify Email 
export const verifyEmail = AsyncHandler(async (req, res) => {
    const { code } = req.body
    const userId = req.user._id
    if (!code || code.trim() === '') throw new AppError("Verification code is required", 400)
    if (isNaN(code)) throw new AppError("invalid code", 400)
    await verifyEmailService(userId,code)
    const token = signAccessToken(userId) ;
    res.status(200).json(ApiResponse( "Email verified",token))
})

//resend code 
export const resendCode=AsyncHandler(async(req,res)=>{
    await sendCodeService(req.user._id)
    res.status(200).json(ApiResponse("Email sent"))
})

