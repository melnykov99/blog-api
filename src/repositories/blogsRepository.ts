import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";
import {blogsCollection} from "./dbConfig";

const blogsRepository = {
    async getBlogs(): Promise<Blog[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            return blogsCollection.find({}).toArray()
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }

    },
    async createBlog(newBlog: Blog): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await blogsCollection.insertOne(newBlog)
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async getBlogById(id: string): Promise<Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundBlog: Blog | null = await blogsCollection.findOne({id: id});
            if (!foundBlog) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundBlog
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async updateBlog(updatedBlog: Blog): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const updatedResult: Blog | null = await blogsCollection.findOneAndUpdate({id: updatedBlog.id}, {
                $set: {
                    name: updatedBlog.name,
                    description: updatedBlog.description,
                    websiteUrl: updatedBlog.websiteUrl
                }
            })
            if (!updatedResult) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async deleteBlog(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const deletionResult: Blog | null = await blogsCollection.findOneAndDelete({id: id});
            if (!deletionResult) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    }
}
export default blogsRepository