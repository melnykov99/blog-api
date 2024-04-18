import express, {Response} from "express";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import postsService from "../services/postsService";
import {Post, PostInput, PostsOutput} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import authBasicMiddleware from "../libs/middlewares/authBasicMiddleware";
import postsValidationChain from "../libs/validations/postsValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../libs/types/requestsResponsesTypes";
import {SortingPaginationQuery} from "../libs/types/commonTypes";
import {CommentInput, CommentOutput, CommentsOutput} from "../libs/types/commentsTypes";
import commentsValidationChain from "../libs/validations/commentsValidation";
import commentsService from "../services/commentsService";
import authBearerMiddleware from "../libs/middlewares/authBearerMiddleware";

const postsRouter = express.Router()

postsRouter.get('/', async (req: RequestWithQuery<SortingPaginationQuery>, res: Response) => {
    const foundPosts: PostsOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsService.getPosts(req.query)
    if (foundPosts === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundPosts)
})
postsRouter.post('/', authBasicMiddleware, postsValidationChain, validationErrorCheck, async (req: RequestWithBody<PostInput>, res: Response) => {
    const createdPost: Post | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsService.createPost(req.body)
    if (createdPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(createdPost)
})

postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
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

postsRouter.put('/:id', authBasicMiddleware, postsValidationChain, validationErrorCheck, async (req: RequestWithParamsAndBody<{
    id: string
}, PostInput>, res: Response) => {
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

postsRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
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
// Запрос комментариев конкретного поста
postsRouter.get('/:postId/comments', async (req: RequestWithParamsAndQuery<{
    postId: string
}, SortingPaginationQuery>, res: Response) => {
    const foundComments: CommentsOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND = await commentsService.getCommentsByPostId(req.params.postId, req.query)
    if (foundComments === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (foundComments === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundComments)
})
// Создание комментарий к конкретному посту
postsRouter.post('/:postId/comments', authBearerMiddleware, commentsValidationChain, validationErrorCheck, async (req: RequestWithParamsAndBody<{
    postId: string
}, CommentInput>, res: Response) => {
    const createdComment: CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await commentsService.createComment(req.params.postId, req.body, req.ctx.userId!);
    if (createdComment === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (createdComment === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(createdComment)
})


export default postsRouter;