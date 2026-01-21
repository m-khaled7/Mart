import express from "express"
import { login, register ,resendCode,verifyEmail} from "./Auth.controller.js"
import unverifiedmdl from "../../middlewares/unverified.middleware.js"
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/verify-email",unverifiedmdl,verifyEmail)
router.get("/email-verify-code",unverifiedmdl,resendCode)

export default router