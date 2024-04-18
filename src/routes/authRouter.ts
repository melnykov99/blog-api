import express, {Request, Response, Router} from "express";
import {RequestWithBody} from "../libs/types/requestsResponsesTypes";
import {
    AccessAndRefreshToken,
    AuthEmailResending,
    AuthLogin,
    AuthMeUserInfo,
    AuthRegistrationConfirmation
} from "../libs/types/authTypes";
import {
    authLoginValidation,
    authRegistrationConfirmationValidation,
    authRegistrationEmailResendingValidation,
    authRegistrationValidation
} from "../libs/validations/authValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";
import authService from "../services/authService";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import authBearerMiddleware from "../libs/middlewares/authBearerMiddleware";
import {UserInput} from "../libs/types/usersTypes";
import emailService from "../libs/common/services/emailService";
import usersService from "../services/usersService";

const authRouter: Router = express.Router();

// Регистрация. Отправляем на указанный в body email письмо с кодом подтверждения.
// В БД создаем юзера, устанавливаем ему confirmationCode с временем жизни 1 сутки. У юзера ключ isConfirmed с значением false
authRouter.post('/registration', authRegistrationValidation, validationErrorCheck, async (req: RequestWithBody<UserInput>, res: Response) => {
    const confirmationCode: string = await emailService.sendRegistrationMessage(req.body.email);
    const createdUserResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersService.createUser(req.body, confirmationCode);
    if (createdUserResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
// Подтверждение юзера. Если валидация прошла, то делаем юзера подтвержденным. confirmationCode и codeExpirationDate становятся null
authRouter.post('/registration-confirmation', authRegistrationConfirmationValidation, validationErrorCheck, async (req: RequestWithBody<AuthRegistrationConfirmation>, res: Response) => {
    const updatedResult: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await usersService.confirmUser(req.body.code)
    if (updatedResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
// Переотправка письма с кодом подтверждения. В БД затираем старый код новым и меняем срок жизни кода
authRouter.post('/registration-email-resending', authRegistrationEmailResendingValidation, validationErrorCheck, async (req: RequestWithBody<AuthEmailResending>, res: Response) => {
    const confirmationCode: string = await emailService.sendRegistrationMessage(req.body.email);
    const updatedResult: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await usersService.updateConfirmationCodeAndExpDate(req.body.email, confirmationCode)
    if (updatedResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
// Авторизация. Если пароль неверный или юзер с таким login/email не найден, то вернем UNAUTHORIZED.
// Если данные правильные, то вернем accessToken в res.body и refreshToken в res.cookie
authRouter.post('/login', authLoginValidation, validationErrorCheck, async (req: RequestWithBody<AuthLogin>, res: Response) => {
    const loginResult: AccessAndRefreshToken | REPOSITORY_RESPONSES.UNAUTHORIZED | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await authService.login(req.body);
    if (loginResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    if (loginResult === REPOSITORY_RESPONSES.NOT_FOUND || loginResult === REPOSITORY_RESPONSES.UNAUTHORIZED) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    res.cookie('refreshToken', loginResult.refreshToken, {httpOnly: true, secure: true})
    res.status(HTTP_STATUSES.OK).send({accessToken: loginResult.accessToken})
})
// В куке запроса приходит refreshToken. Если этот токен не истек и валидный, то возвращаем новую пару access и refresh токенов
authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const refreshTokensResult: AccessAndRefreshToken | REPOSITORY_RESPONSES.UNAUTHORIZED | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await authService.refreshTokens(req.cookies.refreshToken);
    if (refreshTokensResult === REPOSITORY_RESPONSES.UNAUTHORIZED) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    if (refreshTokensResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.cookie('refreshToken', refreshTokensResult.refreshToken, {httpOnly: true, secure: true})
    res.status(HTTP_STATUSES.OK).send({accessToken: refreshTokensResult.accessToken})
})
// Роут идентификации пользователя по accessToken. Токен приходит в headers.authorization, если нашли юзера, то возвращаем инфу о нем: email, login, userId
// Проверка токена и поиск юзера по userId происходит в мидлваре authBearerMiddleware
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