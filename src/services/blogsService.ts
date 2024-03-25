import blogsRepository from "../repositories/blogsRepository";
import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";
import {randomUUID} from "crypto";

const blogsService = {
    async getBlogs(): Promise<Blog[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await blogsRepository.getBlogs()
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<Blog | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const newBlog: Blog = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsRepository.createBlog(newBlog)
        if (createdResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return newBlog
    },
    async getBlogById(id: string): Promise<Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await blogsRepository.getBlogById(id)
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundBlog: Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsRepository.getBlogById(id);
        if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND || foundBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundBlog
        }
        const updatedBlog: Blog = {
            id: foundBlog.id,
            name,
            description,
            websiteUrl,
            createdAt: foundBlog.createdAt,
            isMembership: foundBlog.isMembership
        }
        return blogsRepository.updateBlog(updatedBlog)
    },
    async deleteBlog(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await blogsRepository.deleteBlog(id)
    }
}
export default blogsService;