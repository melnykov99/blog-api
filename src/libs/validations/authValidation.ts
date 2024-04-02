import {body, ValidationChain} from "express-validator";

const authLoginValidation: ValidationChain[] = [
    body('loginOrEmail').isString().bail().trim().notEmpty().bail().isLength({min: 3, max: 10000}),
    body('password').isString().bail().trim().notEmpty().bail().isLength({min: 6, max: 20}),
]
export default authLoginValidation;