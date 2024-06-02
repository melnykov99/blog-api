import {body, ValidationChain} from "express-validator";
import {Blog} from "../types/blogsTypes";
import blogsRepository from "../../repositories/blogsRepository";
import {REPOSITORY_RESPONSES} from "../common/constants/repositoryResponse";
import {COMMON_LIMITS, POST_LIMITS} from "../common/constants/characterLimits";

const postsValidationChain: ValidationChain[] = [
    body("title").isString().bail().trim().notEmpty().bail().isLength({max: POST_LIMITS.title.max}),
    body("shortDescription").isString().bail().trim().notEmpty().bail().isLength({max: POST_LIMITS.shortDescription.max}),
    body("content").isString().bail().trim().notEmpty().bail().isLength({max: POST_LIMITS.content.max}),
    body("blogId").isString().bail().trim().notEmpty().bail().isLength({
        max: COMMON_LIMITS.MAX
    }).custom(async (blogId, {req}) => {
        const foundBlog: Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsRepository.getBlogById(blogId);
        // Если блога с таким blogId не существует или возникла серверная ошибка при запросе в БД, то вернем ошибку
        if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND || foundBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            throw new Error();
        }
        // в postsService нужен будет blogName. Чтобы не искать блог второй раз дополняем req.body здесь
        req.body.blogName = foundBlog.name;
        return true;
    })
];
const postsForBlogValidationChain: ValidationChain[] = [
    body("title").isString().bail().trim().notEmpty().bail().isLength({max: POST_LIMITS.title.max}),
    body("shortDescription").isString().bail().trim().notEmpty().bail().isLength({max: POST_LIMITS.shortDescription.max}),
    body("content").isString().bail().trim().notEmpty().bail().isLength({max: POST_LIMITS.content.max}),
];
export default postsValidationChain;
export {postsForBlogValidationChain};