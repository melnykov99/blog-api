import {AccessAndRefreshToken, AuthLogin, AuthMeUserInfo, InvalidRefreshTokenDB} from "../libs/types/authTypes";
import usersRepository from "../repositories/usersRepository";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User} from "../libs/types/usersTypes";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwtService from "../libs/common/services/jwtService";
import invalidRefreshTokensRepository from "../repositories/invalidRefreshTokensRepository";

const authService = {
    async login(bodyLogin: AuthLogin): Promise<AccessAndRefreshToken | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.UNAUTHORIZED> {
        const foundUser = await usersRepository.getUserByLoginOrEmail(bodyLogin.loginOrEmail);
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
        return {accessToken: accessToken, refreshToken: refreshToken}
    },
    // Проверка пришедшего refreshToken. Если он валидный, то генерируем новую пару access refresh token
    async refreshTokens(refreshToken: string | undefined): Promise<AccessAndRefreshToken | REPOSITORY_RESPONSES.UNAUTHORIZED | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        // Если в куках не прислали refreshToken
        if (!refreshToken) {
            return REPOSITORY_RESPONSES.UNAUTHORIZED
        }
        // undefined вернется, если в payload токена почему-то нет userId. UNAUTHORIZED вернется если токен просрочился.
        const userId: string | undefined | REPOSITORY_RESPONSES.UNAUTHORIZED = await jwtService.getUserIdByJWT(refreshToken);
        if (!userId || userId === REPOSITORY_RESPONSES.UNAUTHORIZED) {
            return REPOSITORY_RESPONSES.UNAUTHORIZED
        }
        // Проверяем валидность токена. Если токен лежит в базе невалидных токенов, то вернем UNAUTHORIZED
        const checkValidityToken: InvalidRefreshTokenDB | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND = await invalidRefreshTokensRepository.checkRefreshToken(refreshToken);
        if (checkValidityToken === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        // Если токен был найден в базе невалидных токенов, то возвращаем UNAUTHORIZED
        if (checkValidityToken !== REPOSITORY_RESPONSES.NOT_FOUND) {
            return REPOSITORY_RESPONSES.UNAUTHORIZED
        }
        return {
            accessToken: await jwtService.createAccessToken(userId),
            refreshToken: await jwtService.createRefreshToken(userId)
        }
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