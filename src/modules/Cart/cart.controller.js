import AsyncHandler from "../../utils/AsyncHandler.js";
import Validator from "../../utils/validator.js";
import {addToCartSchema} from "./validation.Schema.js";
import {addToCartService} from "./cart.service.js";

export const addCart = AsyncHandler(async (req, res) => {
    const {slug, sku} = req.body
    const validData = Validator(addToCartSchema, {slug, sku})
    const result = await addToCartService(req.user._id,validData);
    res.json(result);
})