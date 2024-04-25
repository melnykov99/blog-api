import {AccessAndRefreshToken, AuthLogin, AuthMeUserInfo} from "../libs/types/authTypes";
import usersRepository from "../repositories/usersRepository";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User} from "../libs/types/usersTypes";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwtService from "../libs/common/services/jwtService";
import {DeviceDB, DeviceInputInfo} from "../libs/types/devicesTypes";
import {randomUUID} from "crypto";
import devicesRepository from "../repositories/devicesRepository";
import tokensBlacklistRepository from "../repositories/tokensBlackListRepository";

const authService = {
    async login(bodyLogin: AuthLogin, deviceInfo: DeviceInputInfo): Promise<AccessAndRefreshToken | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.UNAUTHORIZED> {
        const foundUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User = await usersRepository.getUserByLoginOrEmail(bodyLogin.loginOrEmail);
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND || foundUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundUser
        }
        let loginResult;
        // У найденного юзера сравниваем присланный пароль с хэшем. Если пароль верный, то loginResult присваиваем true
        await bcrypt.compare(bodyLogin.password, foundUser.hash).then(result => loginResult = result).catch(err => console.error(err.message));
        // Какая-то серверная проблема при сравнении пароля с хэшем
        if (loginResult === undefined) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        // Пароль неверный
        if (loginResult === false) {
            return REPOSITORY_RESPONSES.UNAUTHORIZED
        }
        // Если пароль верный, то создаем и возвращаем пару access и refresh tokens
        const deviceId: string = randomUUID();
        const accessToken: string = await jwtService.createAccessToken(foundUser.id);
        const refreshToken: string = await jwtService.createRefreshToken(foundUser.id, deviceId);
        const decodedAccessToken = await jwtService.getDecodedToken(accessToken)
        const decodedRefreshToken = await jwtService.getDecodedToken(refreshToken)
        // Создаем новый девайс и добавляем его в БД
        const newDevice: DeviceDB = {
            ip: deviceInfo.ip ?? 'unknown ip',
            title: deviceInfo.browser ?? 'unknown browser',
            // Дата создания только что созданного accessToken, это и будет временем последней активности юзера
            // new Date принимает время в милисекундах, а в refreshToken оно в секундах лежит, поэтому умножаем на 1000
            lastActiveDate: new Date(decodedAccessToken.iat * 1000).toISOString(),
            // Время создания refreshToken, по нему проверяем валидность/актуальность токена
            iatRefreshToken: decodedRefreshToken.iat,
            // Дата, когда истечет refreshToken. Храним в БД, чтобы периодически зачищать девайсы с протухшими сессиями
            expRefreshToken: decodedRefreshToken.exp,
            deviceId: deviceId,
            userId: foundUser.id,
        }
        const addDeviceResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesRepository.addDevice(newDevice)
        if (addDeviceResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return {accessToken: accessToken, refreshToken: refreshToken}
    },
    // При логауте удаляем сессию по deviceId
    async logout(refreshToken: string, deviceId: string): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const deleteDeviceResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesRepository.deleteDeviceById(deviceId)
        if (deleteDeviceResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        // Добавляем refreshToken токен в blacklist
        const decodedToken = await jwtService.getDecodedToken(refreshToken)
        const addRefreshTokenToBlacklist: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await tokensBlacklistRepository.addTokenToBlacklist(refreshToken, decodedToken.exp)
        if (addRefreshTokenToBlacklist === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        // Только при сервеной ошибке возвращаем UNSUCCESSFULLY, даже если в deleteDeviceResult будет NOT_FOUND, то успешно разлогиним пользователя. Значит сессии его уже и так нет
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    },
    // Генерация новой пары access refresh token.
    async refreshTokens(refreshToken: string, userId: string, deviceId: string): Promise<AccessAndRefreshToken | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const accessAndRefreshToken: AccessAndRefreshToken = {
            accessToken: await jwtService.createAccessToken(userId),
            refreshToken: await jwtService.createRefreshToken(userId, deviceId)
        }
        const decodedAccessToken = await jwtService.getDecodedToken(accessAndRefreshToken.accessToken);
        const decodedRefreshToken = await jwtService.getDecodedToken(accessAndRefreshToken.refreshToken);
        // У device меняем lastActiveDate и даты создания/окончания refreshToken
        const updatedResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesRepository.updateDeviceTokenDates(deviceId, (new Date(decodedAccessToken.iat * 1000).toISOString()), decodedRefreshToken.iat, decodedAccessToken.exp)
        if (updatedResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return updatedResult
        }
        // Добавляем refreshToken токен в blacklist
        const decodeOldRefreshToken = await jwtService.getDecodedToken(refreshToken)
        const addRefreshTokenToBlacklist: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await tokensBlacklistRepository.addTokenToBlacklist(refreshToken, decodeOldRefreshToken.exp)
        if (addRefreshTokenToBlacklist === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return accessAndRefreshToken
    },
    async authMe(userId: string): Promise<AuthMeUserInfo | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundUser: User | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersRepository.getUserById(userId);
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND || foundUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundUser
        }
        return {
            email: foundUser.email,
            login: foundUser.login,
            userId,
        }
    },
}
export default authService;