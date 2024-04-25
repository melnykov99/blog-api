import {NextFunction, Request, Response} from "express";
import {REPOSITORY_RESPONSES} from "../common/constants/repositoryResponse";
import jwtService from "../common/services/jwtService";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import devicesRepository from "../../repositories/devicesRepository";
import {DeviceDB} from "../types/devicesTypes";
import tokensBlacklistRepository from "../../repositories/tokensBlackListRepository";
import {TokenBlackList} from "../types/tokenBlackListTypes";

// Мидлвара проверки рефреш токена
// Если refreshToken-а нет, он истек или не находим по его данным device, то прервем запрос и вернем UNAUTHORIZED
async function checkRefreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    const decodedRefreshToken = await jwtService.getDecodedToken(refreshToken)
    // Проверяем не просрочен ли токен
    if (new Date() > (new Date(decodedRefreshToken.exp * 1000))) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // Проверяем что в токене есть информация о userId и deviceId
    if (!decodedRefreshToken.userId || !decodedRefreshToken.deviceId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // TODO: у нас здесь две проверки валидности токена получилось. По блеклисту проверяем и по дате создания в девайсах. Нужно что-то одно выбрать и сделать. !!! UPD: а может и не нужно ниче менять, ведь при удалении девайса нельзя пускать запрос с рефреш токеном этого девайса, поэтому нужна проверка на время создания
    // Проверяем нет ли токена в списке использованных
    const checkTokenInBlacklist: TokenBlackList | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await tokensBlacklistRepository.checkTokenInBlacklist(refreshToken)
    if (checkTokenInBlacklist === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    // Если не нашли токен в списке использованных значит всё ок
    if (checkTokenInBlacklist !== REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    // Проверяем валидность токена. Если не найдем девайс с таким userId и временем создания токена, то прервем запрос
    const checkValidityToken: DeviceDB | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesRepository.getDeviceByRefreshTokenData(decodedRefreshToken.userId, decodedRefreshToken.iat);
    // если серверная ошибка в бд произойдет
    if (checkValidityToken === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    if (checkValidityToken === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED)
        return
    }
    if (!req.ctx) {
        req.ctx = {};
    }
    req.ctx.userId = decodedRefreshToken.userId;
    req.ctx.deviceId = decodedRefreshToken.deviceId;
    next()
}

export default checkRefreshTokenMiddleware;