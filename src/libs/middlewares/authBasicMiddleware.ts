import {Request, Response, NextFunction} from "express";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";

function authBasicMiddleware(req: Request, res: Response, next: NextFunction) {
    const hardcoreToken = "YWRtaW46cXdlcnR5";
    const reqAuthorization: string | undefined = req.headers.authorization;
    // В headers токен лежит в формате: Bearer YWRtaW46cXdlcnR5
    // Поэтому сплитим и берем элемент с токеном. Если токен не равен захардкоженому значению, то кидаем ошибку
    if (!reqAuthorization || reqAuthorization.split(" ")[1] !== hardcoreToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return;
    }
    next();
    return;
}
export default authBasicMiddleware;