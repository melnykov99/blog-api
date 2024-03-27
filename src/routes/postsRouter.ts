import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import postsService from "../services/postsService";
import {Post, PostInput} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";
import authMiddleware from "../libs/middlewares/authMiddleware";
import postsValidationChain from "../libs/validations/postsValidation";
import ValidationErrorCheck from "../libs/validations/validationErrorCheck";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../libs/types/requestsResponsesTypes";
import {SortingPagination} from "../libs/types/commonTypes";

const postsRouter = express.Router()

postsRouter.get('/', async (req: RequestWithQuery<SortingPagination>, res: Response) => {
    const foundPosts: REPOSITORY_RESPONSES.UNSUCCESSFULLY | Post[] = await postsService.getPosts(req.query)
    if (foundPosts === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundPosts)
})
postsRouter.post('/', authMiddleware, postsValidationChain, ValidationErrorCheck, async (req: RequestWithBody<PostInput>, res: Response) => {
    const createdPost: Post | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsService.createPost(req.body)
    if (createdPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(createdPost)
})

postsRouter.get('/:id', async (req: RequestWithParams<{id: string}>, res: Response) => {
    const postId: string = req.params.id
    const foundPost: Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsService.getPostById(postId)
    if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundPost)
})

postsRouter.put('/:id', authMiddleware, postsValidationChain, ValidationErrorCheck, async (req: RequestWithParamsAndBody<{id: string}, PostInput>, res: Response) => {
    const postId: string = req.params.id
    const updatingResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsService.updatePost(postId, req.body)
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

postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{id:string}>, res: Response) => {
    const postId: string = req.params.id
    const deletionResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsService.deletePost(postId)
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


export default postsRouter;