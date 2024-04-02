import {body, ValidationChain} from "express-validator";

const commentsValidationChain: ValidationChain[] = [
    body('content').isString().bail().trim().notEmpty().bail().isLength({min: 20, max: 300}),
]
export default commentsValidationChain;