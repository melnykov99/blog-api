import {body, ValidationChain} from "express-validator";
import {COMMENT_LIMITS} from "../common/constants/characterLimits";

const commentsValidationChain: ValidationChain[] = [
    body('content').isString().bail().trim().notEmpty().bail().isLength({
        min: COMMENT_LIMITS.content.min,
        max: COMMENT_LIMITS.content.max
    }),
]
export default commentsValidationChain;