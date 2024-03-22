import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import blogsService from "../services/blogsService";
import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";
import authMiddleware from "../libs/middlewares/authMiddleware";
import blogsValidationChain from "../libs/validations/blogsValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";

const blogsRouter = express.Router()
blogsRouter.get('/', (req: Request, res: Response) => {
    const foundBlogs: Blog[] = blogsService.getBlogs()
    res.status(HTTP_STATUSES.OK).send(foundBlogs)
})
blogsRouter.post('/', authMiddleware, blogsValidationChain, validationErrorCheck, (req: Request, res: Response) => {
    const createdBlog: Blog = blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    res.status(HTTP_STATUSES.CREATED).send(createdBlog)
})
blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blogId: string = req.params.id.toString()
    const foundBlog: Blog | REPOSITORY_RESPONSE.NOT_FOUND = blogsService.getBlogById(blogId)
    if (foundBlog === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundBlog)
})
blogsRouter.put('/:id', authMiddleware, blogsValidationChain, validationErrorCheck, (req: Request, res: Response) => {
    const blogId: string = req.params.id.toString()
    const {name, description, websiteUrl} = req.body
    const updatingResult: REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY = blogsService.updateBlog(blogId, name, description, websiteUrl)
    if (updatingResult === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
blogsRouter.delete('/:id', authMiddleware, blogsValidationChain, validationErrorCheck, (req: Request, res: Response) => {
    const blogId: string = req.params.id.toString()
    const deletionResult: REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY = blogsService.deleteBlog(blogId)
    if (deletionResult === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

export default blogsRouter;