import postsRepository from "../repositories/postsRepository";
import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";
import {randomUUID} from "crypto";

const postsService = {
    async getPosts(): Promise<Post[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await postsRepository.getPosts()
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<Post | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const newPost: Post = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString(),
        }
        const createdResult: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await postsRepository.createPost(newPost)
        if (createdResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return newPost
    },
    async getPostById(id: string): Promise<Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await postsRepository.getPostById(id)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundPost: REPOSITORY_RESPONSES.UNSUCCESSFULLY | Post | REPOSITORY_RESPONSES.NOT_FOUND = await postsRepository.getPostById(id)
        if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND || foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundPost
        }
        const updatedPost: Post = {
            id: foundPost.id,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: foundPost.createdAt
        }
        return await postsRepository.updatePost(updatedPost)
    },
    async deletePost(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await postsRepository.deletePost(id)
    }
}
export default postsService;