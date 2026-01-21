import AppError from "./AppError.js";

export default (schema, data) => {
    const validationFields = schema.safeParse(data);
    if (!validationFields.success) {
        const errors = validationFields.error.flatten().fieldErrors
        throw new AppError("validation error", 400, errors);
    }
    return validationFields.data;
}