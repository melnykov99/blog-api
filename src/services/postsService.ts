import postsRepository from "../repositories/postsRepository";
import {CountAndPostsDB, OutputPagesPosts, Post, PostInput, PostOutput} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {randomUUID} from "crypto";
import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import sortingPaginationService from "../libs/common/services/sortingPaginationService";

const postsService = {
    async getPosts(query: SortingPaginationQuery): Promise<OutputPagesPosts | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const sortingPaginationProcessed: SortingPaginationProcessed = sortingPaginationService.processingSortPag(query, 'posts')
        const postsAndCount: CountAndPostsDB | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPosts(sortingPaginationProcessed)
        if (postsAndCount === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return postsAndCount
        }
        const postsOutput: PostOutput[] = postsAndCount.foundPosts.map(post => this._mapPostToOutput(post))
        return {
            pagesCount: Math.ceil(postsAndCount.totalCount / sortingPaginationProcessed.pagination.pageSize),
            page: sortingPaginationProcessed.pagination.pageNumber,
            pageSize: sortingPaginationProcessed.pagination.pageSize,
            totalCount: postsAndCount.totalCount,
            items: postsOutput
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
    async getPostById(id: string): Promise<PostOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundPost: Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPostById(id);
        if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND || foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundPost
        }
        //Этот метод убирает _id монговский у поста. Этот _id не описан в типах
        return this._mapPostToOutput(foundPost)
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
    },
    //Этот метод убирает _id монговский у поста. Этот _id не описан в типах
    _mapPostToOutput(post: Post): PostOutput {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
    }
}
export default postsService;