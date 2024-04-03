import express, {Response, Router} from "express";
import {RequestWithParams} from "../libs/types/requestsResponsesTypes";
import commentsService from "../services/commentsService";
import {CommentOutput} from "../libs/types/commentsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";

const commentsRouter: Router = express.Router();

commentsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const foundComment: CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await commentsService.getCommentById(req.params.id);
    if (foundComment === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (foundComment === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundComment)
})

export default commentsRouter;