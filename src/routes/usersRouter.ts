import express, {Response, Router} from "express";
import authMiddleware from "../libs/middlewares/authMiddleware";
import {RequestWithQuery} from "../libs/types/requestsResponsesTypes";
import {SortingPaginationQuery} from "../libs/types/commonTypes";
import usersService from "../services/usersService";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {UsersOutput} from "../libs/types/usersTypes";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";

const usersRouter: Router = express.Router();

usersRouter.get('/', authMiddleware, async (req: RequestWithQuery<SortingPaginationQuery>, res: Response) => {
    const foundUsers: REPOSITORY_RESPONSES.UNSUCCESSFULLY | UsersOutput = await usersService.getUsers(req.query)
    if (foundUsers === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundUsers)
})
usersRouter.post('/', authMiddleware, (req, res) => {

})
usersRouter.delete('/:id', authMiddleware, (req, res) => {

})
export default usersRouter;