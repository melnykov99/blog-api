import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {tokensBlacklistCollection} from "./dbConfig";
import {TokenBlackList} from "../libs/types/tokenBlackListTypes";

const tokensBlacklistRepository = {
    async addTokenToBlacklist(refreshToken: string, expRefreshToken: number): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await tokensBlacklistCollection.insertOne({refreshToken, expRefreshToken});
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async checkTokenInBlacklist(refreshToken: string): Promise<TokenBlackList | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundToken: TokenBlackList | null = await tokensBlacklistCollection.findOne({refreshToken});
            if (foundToken === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND;
            }
            return foundToken;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
};
export default tokensBlacklistRepository;