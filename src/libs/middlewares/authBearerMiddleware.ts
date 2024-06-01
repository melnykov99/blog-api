import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import jwtService from "../common/services/jwtService";
import {REPOSITORY_RESPONSES, SERVICE_RESPONSES} from "../common/constants/repositoryResponse";

async function authBearerMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // В headers токен лежит в формате: Bearer YWRtaW46cXdlcnR5. Поэтому сплитим и берем элемент с токеном
    const token: string = req.headers.authorization.split(' ')[1];
    // undefined вернется, если в payload токена почему-то нет userId. UNAUTHORIZED вернется если токен просрочился.
    const userId: string | SERVICE_RESPONSES.UNAUTHORIZED | undefined = await jwtService.getUserIdByJWT(token);
    if (!userId || userId === SERVICE_RESPONSES.UNAUTHORIZED) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // Определяем req.ctx
    if (!req.ctx) {
        req.ctx = {};
    }
    // Записываем в req.ctx полученный userId из токена. Понадобится для дальнейших операций в роутах
    req.ctx.userId = userId;
    next()
}

export default authBearerMiddleware;