import {Blog, BlogsDbOutput, BlogsOutput} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {blogsCollection} from "./dbConfig";
import {UpdateResult} from "mongodb";
import {DbProperties} from "../libs/types/commonTypes";

const blogsRepository = {
    async getBlogs(dbProp: DbProperties): Promise<BlogsDbOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const filter = {}
            const totalCount: number = await blogsCollection.countDocuments(filter)
            const foundBlogs: Blog[] = await blogsCollection.find(filter, {projection: {_id: false}}).skip(dbProp.skip).limit(dbProp.limit).toArray()
            return {totalCount, foundBlogs}
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async createBlog(newBlog: Blog): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await blogsCollection.insertOne({...newBlog})
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async getBlogById(id: string): Promise<Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundBlog: Blog | null = await blogsCollection.findOne({id: id}, {projection: {_id: false}});
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
            const updatedResult: UpdateResult<Blog> = await blogsCollection.updateOne({id: updatedBlog.id}, {
                $set: {
                    name: updatedBlog.name,
                    description: updatedBlog.description,
                    websiteUrl: updatedBlog.websiteUrl
                }
            })
            if (updatedResult.matchedCount === 0) {
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