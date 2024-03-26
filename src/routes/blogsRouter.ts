import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import blogsService from "../services/blogsService";
import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";
import authMiddleware from "../libs/middlewares/authMiddleware";
import blogsValidationChain from "../libs/validations/blogsValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";
import {Post} from "../libs/types/postsTypes";
import {postsForBlogValidationChain} from "../libs/validations/postsValidation";

const blogsRouter = express.Router()
blogsRouter.get('/', async (req: Request, res: Response) => {
    const foundBlogs: Blog[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.getBlogs();
    if (foundBlogs === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundBlogs)
})
blogsRouter.post('/', authMiddleware, blogsValidationChain, validationErrorCheck, async (req: Request, res: Response) => {
    const createdBlog: Blog | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    if (createdBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(createdBlog)
})
blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const foundBlog: Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.getBlogById(blogId)
    if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (foundBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundBlog)
})
blogsRouter.put('/:id', authMiddleware, blogsValidationChain, validationErrorCheck, async (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const {name, description, websiteUrl} = req.body
    const updatingResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.updateBlog(blogId, name, description, websiteUrl)
    if (updatingResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (updatingResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
blogsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const deletionResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.deleteBlog(blogId)
    if (deletionResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (deletionResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const posts: Post[] | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.getPostsByBlogId(blogId)
    if (posts === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (posts === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send({items: posts})
})

blogsRouter.post('/:id/posts', authMiddleware, postsForBlogValidationChain, validationErrorCheck, async (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const createdPost: Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.createPostByBlogId(blogId, req.body.title, req.body.shortDescription, req.body.content)
    if (createdPost === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (createdPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(createdPost)
})

export default blogsRouter;