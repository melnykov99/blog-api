import express, {Request, Response, Router} from "express";
import {RequestWithBody} from "../libs/types/requestsResponsesTypes";
import {
    AuthEmailResending,
    AuthLogin,
    AuthLoginOutput,
    AuthMeUserInfo,
    AuthRegistrationConfirmation
} from "../libs/types/authTypes";
import authLoginValidation from "../libs/validations/authValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";
import authService from "../services/authService";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import authBearerMiddleware from "../libs/middlewares/authBearerMiddleware";
import {UserInput} from "../libs/types/usersTypes";
import emailService from "../libs/common/services/emailService";
import usersService from "../services/usersService";

const authRouter: Router = express.Router();

authRouter.post('/registration', async (req: RequestWithBody<UserInput>, res: Response) => {
    const confirmationCode: string = await emailService.sendRegistrationMessage(req.body.email);
    const createdUserResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersService.createUser(req.body, confirmationCode);
    if (createdUserResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
authRouter.post('/registration-confirmation', (req: RequestWithBody<AuthRegistrationConfirmation>, res: Response) => {
    // verified email
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
authRouter.post('/registration-email-resending', (req: RequestWithBody<AuthEmailResending>, res: Response) => {
    // resending email
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
authRouter.post('/login', authLoginValidation, validationErrorCheck, async (req: RequestWithBody<AuthLogin>, res: Response) => {
    const loginResult: AuthLoginOutput | REPOSITORY_RESPONSES.UNAUTHORIZED | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await authService.login(req.body);
    if (loginResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    if (loginResult === REPOSITORY_RESPONSES.NOT_FOUND || loginResult === REPOSITORY_RESPONSES.UNAUTHORIZED) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    res.status(HTTP_STATUSES.OK).send(loginResult)
})
authRouter.get('/me', authBearerMiddleware, async (req: Request, res: Response) => {
    const userInfo: AuthMeUserInfo | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await authService.authMe(req.ctx.userId!);
    if (userInfo === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    if (userInfo === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(userInfo)
})

export default authRouter;