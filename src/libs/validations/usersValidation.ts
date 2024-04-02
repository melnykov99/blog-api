import {body, ValidationChain} from "express-validator";

const usersValidationChain: ValidationChain[] = [
    body('login').isString().bail().trim().notEmpty().bail().isLength({min:3, max: 10}).bail().matches(/^[a-zA-Z0-9_-]*$/),
    body('email').isString().bail().trim().notEmpty().bail().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    body('password').isString().bail().trim().notEmpty().bail().isLength({min: 6, max: 20}),
]
export default usersValidationChain;