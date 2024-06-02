import {body, ValidationChain} from "express-validator";
import {BLOG_LIMITS} from "../common/constants/characterLimits";

const blogsValidationChain: ValidationChain[] = [
    body("name").isString().bail().trim().notEmpty().bail().isLength({
        max: BLOG_LIMITS.name.max
    }),
    body("description").isString().bail().trim().notEmpty().bail().isLength({
        max: BLOG_LIMITS.description.max
    }),
    body("websiteUrl").isString().bail().trim().notEmpty().bail().isLength({
        max: BLOG_LIMITS.websiteUrl.max
    }).bail().isURL(),
];
export default blogsValidationChain;