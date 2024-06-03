import {body, ValidationChain} from "express-validator";
import {COMMON_LIMITS, LOGIN_LIMITS, PASSWORD_LIMITS} from "../common/constants/characterLimits";

const usersValidationChain: ValidationChain[] = [
    body("login").isString().bail().trim().notEmpty().bail().isLength({
        min: LOGIN_LIMITS.MIN,
        max: LOGIN_LIMITS.MAX,
    }).bail().matches(/^[a-zA-Z0-9_-]*$/),
    body("email").isString().bail().trim().notEmpty().bail().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).isLength({max: COMMON_LIMITS.MAX}),
    body("password").isString().bail().trim().notEmpty().bail().isLength({min: PASSWORD_LIMITS.MIN, max: PASSWORD_LIMITS.MAX}),
];
export default usersValidationChain;