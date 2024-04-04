import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import jwtService from "../common/utils/jwt";

async function authBearerMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    const token: string = req.headers.authorization.split(' ')[1]
    const userId: string | undefined = await jwtService.getUserIdByJWT(token)
    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // Определяем req.ctx
    if (!req.ctx) {
        req.ctx = {};
    }
    req.ctx.userId = userId;
    next()
}

export default authBearerMiddleware;