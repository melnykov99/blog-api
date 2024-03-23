import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import postsService from "../services/postsService";
import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";
import authMiddleware from "../libs/middlewares/authMiddleware";
import postsValidationChain from "../libs/validations/postsValidation";
import ValidationErrorCheck from "../libs/validations/validationErrorCheck";

const postsRouter = express.Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const foundPosts: Post[] = postsService.getPosts()
    res.status(HTTP_STATUSES.OK).send(foundPosts)
})
postsRouter.post('/', authMiddleware, postsValidationChain, ValidationErrorCheck, (req: Request, res: Response) => {
    const createdPost: Post = postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)
    res.status(HTTP_STATUSES.CREATED).send(createdPost)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const postId: string = req.params.id.toString()
    const foundPost: Post | REPOSITORY_RESPONSES.NOT_FOUND = postsService.getPostById(postId)
    if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.status(HTTP_STATUSES.OK).send()
})

postsRouter.put('/:id', authMiddleware, postsValidationChain, ValidationErrorCheck, (req: Request, res: Response) => {
    const postId: string = req.params.id.toString()
    const updatingResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY = postsService.updatePost(postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)
    if (updatingResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

postsRouter.delete('/:id', authMiddleware, postsValidationChain, ValidationErrorCheck, (req: Request, res: Response) => {
    const postId: string = req.params.id.toString()
    const deletionResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY = postsService.deletePost(postId)
    if (deletionResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})


export default postsRouter;