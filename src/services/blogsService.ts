import blogsRepository from "../repositories/blogsRepository";
import {Blog, BlogInput} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";
import {randomUUID} from "crypto";
import {Post, PostInput, PostInputWithoutBlog} from "../libs/types/postsTypes";
import postsRepository from "../repositories/postsRepository";
import {SortingPagination} from "../libs/types/commonTypes";

const blogsService = {
    async getBlogs(query: SortingPagination): Promise<Blog[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await blogsRepository.getBlogs()
    },
    async createBlog(bodyBlog: BlogInput): Promise<Blog | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const newBlog: Blog = {
            id: randomUUID(),
            name: bodyBlog.name,
            description: bodyBlog.description,
            websiteUrl: bodyBlog.websiteUrl,
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
    async updateBlog(id: string, bodyBlog: BlogInput): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundBlog: Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsRepository.getBlogById(id);
        if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND || foundBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundBlog
        }
        const updatedBlog: Blog = {
            id: foundBlog.id,
            name: bodyBlog.name,
            description: bodyBlog.description,
            websiteUrl: bodyBlog.websiteUrl,
            createdAt: foundBlog.createdAt,
            isMembership: foundBlog.isMembership
        }
        return blogsRepository.updateBlog(updatedBlog)
    },
    async deleteBlog(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await blogsRepository.deleteBlog(id)
    },
    async getPostsByBlogId(blogId: string): Promise<Post[] | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await postsRepository.getPostsByBlogId(blogId)
    },
    async createPostByBlogId(blogId: string, postBody: PostInputWithoutBlog) {
        const foundBlog: Blog | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await this.getBlogById(blogId)
        if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND || foundBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundBlog
        }
        const newPost = {
            id: randomUUID(),
            title: postBody.title,
            shortDescription: postBody.shortDescription,
            content: postBody.shortDescription,
            blogId,
            blogName: foundBlog.name,
            createdAt: new Date().toISOString(),
        }
        const createdResult: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await postsRepository.createPost(newPost)
        if (createdResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return newPost
    }
}
export default blogsService;