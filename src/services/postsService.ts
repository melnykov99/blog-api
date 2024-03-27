import postsRepository from "../repositories/postsRepository";
import {Post, PostInput, PostsDbOutput, PostsOutput} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {randomUUID} from "crypto";
import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import handlerSortingPagination from "../libs/common/utils/handlerSortingPagination";

const postsService = {
    async getPosts(query: SortingPaginationQuery): Promise<PostsOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const sortingPaginationProcessed: SortingPaginationProcessed = handlerSortingPagination(query)
        const postsDbOutput: PostsDbOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPosts(sortingPaginationProcessed.dbProperties)
        if (postsDbOutput === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return postsDbOutput
        }
        return {
            pagesCount: Math.ceil(postsDbOutput.totalCount / sortingPaginationProcessed.pagination.pageSize),
            page: sortingPaginationProcessed.pagination.pageNumber,
            pageSize: sortingPaginationProcessed.pagination.pageSize,
            totalCount: postsDbOutput.totalCount,
            items: postsDbOutput.foundPosts
        }
    },
    async createPost(postBody: PostInput): Promise<Post | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const newPost: Post = {
            id: randomUUID(),
            title: postBody.title,
            shortDescription: postBody.shortDescription,
            content: postBody.content,
            blogId: postBody.blogId,
            blogName: postBody.blogName,
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
    async updatePost(id: string, postBody: PostInput): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundPost: REPOSITORY_RESPONSES.UNSUCCESSFULLY | Post | REPOSITORY_RESPONSES.NOT_FOUND = await postsRepository.getPostById(id)
        if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND || foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundPost
        }
        const updatedPost: Post = {
            id: foundPost.id,
            title: postBody.title,
            shortDescription: postBody.shortDescription,
            content: postBody.content,
            blogId: postBody.blogId,
            blogName: postBody.blogName,
            createdAt: foundPost.createdAt
        }
        return await postsRepository.updatePost(updatedPost)
    },
    async deletePost(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await postsRepository.deletePost(id)
    }
}
export default postsService;