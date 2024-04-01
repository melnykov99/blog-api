import express, {Response, Router} from "express";
import authMiddleware from "../libs/middlewares/authMiddleware";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../libs/types/requestsResponsesTypes";
import {SortingPaginationQuery} from "../libs/types/commonTypes";
import usersService from "../services/usersService";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {UserInput, UserOutput, UsersOutput} from "../libs/types/usersTypes";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import usersValidationChain from "../libs/validations/usersValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";

const usersRouter: Router = express.Router();

usersRouter.get('/', authMiddleware, async (req: RequestWithQuery<SortingPaginationQuery>, res: Response) => {
    const foundUsers: REPOSITORY_RESPONSES.UNSUCCESSFULLY | UsersOutput = await usersService.getUsers(req.query)
    if (foundUsers === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundUsers)
})
usersRouter.post('/', authMiddleware, usersValidationChain, validationErrorCheck, async (req: RequestWithBody<UserInput>, res: Response) => {
    const createdUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | UserOutput = await usersService.createUser(req.body)
    if (createdUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(createdUser)
})
usersRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
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