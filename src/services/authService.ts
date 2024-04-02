import {AuthLogin} from "../libs/types/authTypes";
import usersRepository from "../repositories/usersRepository";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User} from "../libs/types/usersTypes";
import bcrypt from "bcrypt";

const authService = {
    async authLogin(bodyLogin: AuthLogin): Promise<boolean | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundUser: User | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersRepository.getUserByLoginOrEmail(bodyLogin.loginOrEmail);
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND || foundUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundUser
        }
        let loginResult;
        await bcrypt.compare(bodyLogin.password, foundUser.hash).then(result => loginResult = result).catch(err => console.error(err.message));
        if (loginResult === undefined) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return loginResult;
    }
}
export default authService;