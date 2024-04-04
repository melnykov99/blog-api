import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./dbConfig";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";

export const testingRepository = {
    async deleteAllData(): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await blogsCollection.deleteMany({})
            await postsCollection.deleteMany({})
            await usersCollection.deleteMany({})
            await commentsCollection.deleteMany({})
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        }
        catch (error){
            console.log(error)
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }

    }
}