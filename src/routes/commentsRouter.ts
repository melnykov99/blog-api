import express, {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../libs/types/requestsResponsesTypes";
import commentsService from "../services/commentsService";
import {CommentInput, CommentOutput} from "../libs/types/commentsTypes";
import {REPOSITORY_RESPONSES, SERVICE_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import authBearerMiddleware from "../libs/middlewares/authBearerMiddleware";
import commentsValidationChain from "../libs/validations/commentsValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";

const commentsRouter: Router = express.Router();

commentsRouter.get("/:id", async (req: RequestWithParams<{ id: string }>, res: Response<CommentOutput>) => {
    const foundComment: CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await commentsService.getCommentById(req.params.id);
    if (foundComment === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (foundComment === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.status(HTTP_STATUSES.OK).send(foundComment);
});
commentsRouter.put("/:id", authBearerMiddleware, commentsValidationChain, validationErrorCheck, async (req: RequestWithParamsAndBody<{id: string}, CommentInput>, res: Response) => {
    const updatingResult: SERVICE_RESPONSES.FORBIDDEN | REPOSITORY_RESPONSES = await commentsService.updateComment(req.params.id, req.body, req.ctx.userId!);
    if (updatingResult === SERVICE_RESPONSES.FORBIDDEN) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN);
        return;
    }
    if (updatingResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (updatingResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
commentsRouter.delete("/:id", authBearerMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const deletionResult: SERVICE_RESPONSES.FORBIDDEN | REPOSITORY_RESPONSES = await commentsService.deleteComment(req.params.id, req.ctx.userId!);
    if (deletionResult === SERVICE_RESPONSES.FORBIDDEN) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN);
        return;
    }
    if (deletionResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (deletionResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
export default commentsRouter;