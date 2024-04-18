import {NextFunction, Request, Response} from "express";
import {REPOSITORY_RESPONSES} from "../common/constants/repositoryResponse";
import jwtService from "../common/services/jwtService";
import {InvalidRefreshTokenDB} from "../types/authTypes";
import invalidRefreshTokensRepository from "../../repositories/invalidRefreshTokensRepository";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";

// Мидлвара проверки рефреш токена из куки. Если его нет, он истек или лежит в базе невалидных токенов, то прервем запрос и вернем UNAUTHORIZED
async function checkRefreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // undefined вернется, если в payload токена почему-то нет userId. UNAUTHORIZED вернется если токен просрочился.
    const userId: string | undefined | REPOSITORY_RESPONSES.UNAUTHORIZED = await jwtService.getUserIdByJWT(refreshToken);
    if (!userId || userId === REPOSITORY_RESPONSES.UNAUTHORIZED) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // Проверяем валидность токена. Если токен лежит в базе невалидных токенов, то вернем UNAUTHORIZED
    const checkValidityToken: InvalidRefreshTokenDB | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND = await invalidRefreshTokensRepository.checkRefreshToken(refreshToken);
        // если серверная ошибка в бд произойдет
    if (checkValidityToken === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    if (checkValidityToken !== REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    if (!req.ctx) {
        req.ctx = {};
    }
    req.ctx.userId = userId;
    next()
}
export default checkRefreshTokenMiddleware;