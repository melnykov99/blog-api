import express, {Response, Router} from "express";
import authMiddleware from "../libs/middlewares/authMiddleware";
import {RequestWithQuery} from "../libs/types/requestsResponsesTypes";
import {SortingPaginationQuery} from "../libs/types/commonTypes";
import usersService from "../services/usersService";

const usersRouter: Router = express.Router();

usersRouter.get('/', authMiddleware, async (req: RequestWithQuery<SortingPaginationQuery>, res: Response) => {
    const foundUsers = await usersService.getUsers(req.query)
})
usersRouter.post('/', authMiddleware, (req, res) => {

})
usersRouter.delete('/:id', authMiddleware, (req, res) => {

})
export default usersRouter;