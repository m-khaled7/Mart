import express from "express"
import modules from "./modules/index.js"
const router= express.Router()

router.use("/auth", modules.auth)
router.use("/category",modules.category)
router.use("/product",modules.Products)

export default router