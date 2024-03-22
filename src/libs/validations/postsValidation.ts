import {body, ValidationChain} from "express-validator";

const postsValidationChain: ValidationChain[] = [
    body('title').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 30}),
    body('shortDescription').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 100}),
    body('content').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 1000}),
    body('blogId').isString().bail().trim().notEmpty().bail()
    //TODO: custom валидакцию доделать на проверку blogId. Если нашли, то в req.body blogName добавить
]
export default postsValidationChain;