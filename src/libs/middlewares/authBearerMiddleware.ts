import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import jwtService from "../common/services/jwtService";

async function authBearerMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // В headers токен лежит в формате: Bearer YWRtaW46cXdlcnR5. Поэтому сплитим и берем элемент с токеном
    const token: string = req.headers.authorization.split(' ')[1];
    const userId: string | undefined = await jwtService.getUserIdByJWT(token);
    // Если в токене нет инфы по userId значит токен невалидный
    if (!userId) {
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