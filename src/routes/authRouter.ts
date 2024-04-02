import express, {Response, Router} from "express";
import {RequestWithBody} from "../libs/types/requestsResponsesTypes";
import {AuthLogin} from "../libs/types/authTypes";
import authLoginValidation from "../libs/validations/authValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";
import authService from "../services/authService";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";

const authRouter: Router = express.Router();

authRouter.post('/login', authLoginValidation, validationErrorCheck, async (req: RequestWithBody<AuthLogin>, res: Response) => {
    const loginResult: boolean | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await authService.authLogin(req.body);
    if (loginResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    if (loginResult === false || loginResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

export default authRouter;