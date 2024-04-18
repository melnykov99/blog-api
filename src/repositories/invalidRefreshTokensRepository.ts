import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {invalidRefreshTokensCollection} from "./dbConfig";
import {InvalidRefreshTokenDB} from "../libs/types/authTypes";

const invalidRefreshTokensRepository = {
    async checkRefreshToken(refreshToken: string): Promise<InvalidRefreshTokenDB | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundToken: InvalidRefreshTokenDB | null = await invalidRefreshTokensCollection.findOne({refreshToken});
            if (!foundToken) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundToken
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
}
export default invalidRefreshTokensRepository;