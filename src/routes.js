import express from "express"
import modules from "./modules/index.js"
const router= express.Router()

router.use("/auth", modules.auth)

export default router