import {body, ValidationChain} from "express-validator";

const blogsValidationChain: ValidationChain[] = [
    body('name').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 15}),
    body('description').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 500}),
    body('websiteUrl').isString().bail().trim().notEmpty().bail().isLength({max: 500}).bail().isURL(),
]
export default blogsValidationChain;