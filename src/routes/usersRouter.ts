import express, {Response, Router} from "express";
import authBasicMiddleware from "../libs/middlewares/authBasicMiddleware";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../libs/types/requestsResponsesTypes";
import {SortingPaginationQuery} from "../libs/types/commonTypes";
import usersService from "../services/usersService";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {UserInput, UserOutput, OutputPagesUsers} from "../libs/types/usersTypes";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import usersValidationChain from "../libs/validations/usersValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";

const usersRouter: Router = express.Router();

usersRouter.get('/', authBasicMiddleware, async (req: RequestWithQuery<SortingPaginationQuery>, res: Response) => {
    const foundUsers: REPOSITORY_RESPONSES.UNSUCCESSFULLY | OutputPagesUsers = await usersService.getUsers(req.query)
    if (foundUsers === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundUsers)
})
// Ручное создание юзера "суперадмином". Юзер сразу становится подтвержденным.
usersRouter.post('/', authBasicMiddleware, usersValidationChain, validationErrorCheck, async (req: RequestWithBody<UserInput>, res: Response) => {
    const createdUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | UserOutput = await usersService.manualCreateUser(req.body)
    if (createdUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(createdUser)
})
usersRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const deletionResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await usersService.deleteUser(req.params.id)
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
export default usersRouter;