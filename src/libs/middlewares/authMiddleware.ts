import {Request, Response, NextFunction} from "express";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const hardcoreToken = 'YWRtaW46cXdlcnR5';
    const reqAuthorization: string | undefined = req.headers.authorization;
    if (!reqAuthorization || reqAuthorization.split(' ')[1] !== hardcoreToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    next()
    return
}
export default authMiddleware;