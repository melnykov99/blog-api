import {testingRepository} from "../repositories/testingRepository";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";

export const testingService = {
    async deleteAllData(): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await testingRepository.deleteAllData()
    }
}