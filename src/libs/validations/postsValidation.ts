import {body, ValidationChain} from "express-validator";
import {Blog} from "../types/blogsTypes";
import {blogsCollection} from "../../repositories/dbConfig";

const postsValidationChain: ValidationChain[] = [
    body('title').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 30}),
    body('shortDescription').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 100}),
    body('content').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 1000}),
    body('blogId').isString().bail().trim().notEmpty().bail().custom(async (blogId, {req}) => {
        const foundBlog: Blog | null = await blogsCollection.findOne({id: blogId})
        if (!foundBlog) {
            throw new Error();
        }
        // в postsService нужен будет blogName. Чтобы не искать блог второй раз дополняем req.body здесь
        req.body.blogName = foundBlog.name;
        return true;
    })
]
const postsForBlogValidationChain: ValidationChain[] = [
    body('title').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 30}),
    body('shortDescription').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 100}),
    body('content').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 1000}),
]
export default postsValidationChain;
export {postsForBlogValidationChain};