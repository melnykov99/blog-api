import {AuthLogin, AuthMeUserInfo, AuthLoginOutput} from "../libs/types/authTypes";
import usersRepository from "../repositories/usersRepository";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User} from "../libs/types/usersTypes";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwtService from "../libs/common/utils/jwt";

const authService = {
    async authLogin(bodyLogin: AuthLogin): Promise<AuthLoginOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.UNAUTHORIZED> {
        const foundUser: User | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersRepository.getUserByLoginOrEmail(bodyLogin.loginOrEmail);
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND || foundUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundUser
        }
        let loginResult;
        await bcrypt.compare(bodyLogin.password, foundUser.hash).then(result => loginResult = result).catch(err => console.error(err.message));
        if (loginResult === undefined) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        if (loginResult === false) {
            return REPOSITORY_RESPONSES.UNAUTHORIZED
        }
        const token: string = await jwtService.createJWT(foundUser.id);
        return {accessToken: token}
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
    }
}
export default authService;