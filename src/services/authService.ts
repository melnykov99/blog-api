import {AccessAndRefreshToken, AuthLogin, AuthLoginOutput, AuthMeUserInfo} from "../libs/types/authTypes";
import usersRepository from "../repositories/usersRepository";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User} from "../libs/types/usersTypes";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwtService from "../libs/common/services/jwtService";
import invalidRefreshTokensRepository from "../repositories/invalidRefreshTokensRepository";
import {DeviceDB, DeviceInputInfo} from "../libs/types/devicesTypes";
import {randomUUID} from "crypto";
import devicesRepository from "../repositories/devicesRepository";

const authService = {
    async login(bodyLogin: AuthLogin, deviceInfo: DeviceInputInfo): Promise<AuthLoginOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.UNAUTHORIZED> {
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
        const accessToken: string = await jwtService.createAccessToken(foundUser.id);
        const refreshToken: string = await jwtService.createRefreshToken(foundUser.id)
        const decodedAccessToken = await jwtService.getDecodedToken(accessToken)
        const decodedRefreshToken = await jwtService.getDecodedToken(refreshToken)
        // Создаем новый девайс и добавляем его в БД
        const newDevice: DeviceDB = {
            ip: deviceInfo.ip ?? 'unknown ip',
            title: deviceInfo.browser ?? 'unknown browser',
            // Дата создания только что созданного accessToken, это и будет временем последней активности юзера
            lastActiveDate: decodedAccessToken.iat,
            // Дата, когда истечет refreshToken. Храним в БД, чтобы периодически зачищать девайсы с протухшими сессиями
            expirationSessionDate: decodedRefreshToken.exp,
            deviceId: randomUUID(),
            userId: foundUser.id,
        }
        const addDeviceResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesRepository.addDevice(newDevice)
        if (addDeviceResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return {tokens: {accessToken: accessToken, refreshToken: refreshToken}, deviceId: newDevice.deviceId}
    },
    // При логауте делаем токен инвалидным и удаляем сессию по deviceId
    async logout(refreshToken: string, deviceId: string): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const invalidTokenResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await invalidRefreshTokensRepository.addRefreshTokenToInvalid(refreshToken)
        if (invalidTokenResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        const deleteDeviceResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesRepository.deleteDeviceById(deviceId)
        if (deleteDeviceResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        // Только при сервеной ошибке возвращаем UNSUCCESSFULLY, даже если в deleteDeviceResult будет NOT_FOUND, то успешно разлогиним пользователя. Значит сессии его уже итак нет
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    },
    // Генерация новой пары access refresh token.
    async refreshTokens(refreshToken: string, userId: string): Promise<AccessAndRefreshToken | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const accessAndRefreshToken: AccessAndRefreshToken = {
            accessToken: await jwtService.createAccessToken(userId),
            refreshToken: await jwtService.createRefreshToken(userId)
        }
        // Старый токен делаем невалидным
        const addRefreshTokenToInvalid: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await invalidRefreshTokensRepository.addRefreshTokenToInvalid(refreshToken);
        if (addRefreshTokenToInvalid === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
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