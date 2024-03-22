import {body, ValidationChain} from "express-validator";
import {blogs} from "../../repositories/blogsRepository";
import {Blog} from "../types/blogsTypes";

const postsValidationChain: ValidationChain[] = [
    body('title').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 30}),
    body('shortDescription').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 100}),
    body('content').isString().bail().trim().notEmpty().bail().isLength({min: 1, max: 1000}),
    body('blogId').isString().bail().trim().notEmpty().bail().custom((blogId, {req}) => {
        const foundBlog: Blog | undefined = blogs.find(blog => blog.id === blogId);
        if (!foundBlog) {
            throw new Error();
        }
        // в postsService нужен будет blogName. Чтобы не искать блог второй раз меняем req.body здесь
        req.body.blogName = foundBlog.name;
        return true;
    })
]
export default postsValidationChain;