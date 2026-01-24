import express from "express"
import routeGard from "./middlewares/routeGard.midddleware.js";
import authRoute from "./modules/Auth/Auth.route.js";
import cartRoute from "./modules/Cart/route.js"
const router= express.Router()

router.use("/auth", authRoute)
router.use("/cart",routeGard,cartRoute)

export default router