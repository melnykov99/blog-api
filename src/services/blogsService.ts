import blogsRepository from "../repositories/blogsRepository";
import {Blog, BlogInput, BlogOutput, CountAndBlogsDB, OutputPagesBlogs} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {randomUUID} from "crypto";
import {PostInputWithoutBlog, PostsDbOutput, PostsOutput} from "../libs/types/postsTypes";
import postsRepository from "../repositories/postsRepository";
import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import sortingPaginationService from "../libs/common/services/sortingPaginationService";

const blogsService = {
    async getBlogs(query: SortingPaginationQuery): Promise<OutputPagesBlogs | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const sortingPaginationProcessed: SortingPaginationProcessed = sortingPaginationService.processingSortPag(query)
        const blogsAndCount: REPOSITORY_RESPONSES.UNSUCCESSFULLY | CountAndBlogsDB = await blogsRepository.getBlogs(sortingPaginationProcessed)
        if (blogsAndCount === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return blogsAndCount
        }
        const blogsOutput: BlogOutput[] = blogsAndCount.foundBlogs.map(blog => this._mapBlogToOutput(blog))
        return {
            pagesCount: Math.ceil(blogsAndCount.totalCount / sortingPaginationProcessed.pagination.pageSize),
            page: sortingPaginationProcessed.pagination.pageNumber,
            pageSize: sortingPaginationProcessed.pagination.pageSize,
            totalCount: blogsAndCount.totalCount,
            items: blogsOutput
        }
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
    async getPostsByBlogId(blogId: string, query: SortingPaginationQuery): Promise<PostsOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundBlog: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY | Blog = await blogsRepository.getBlogById(blogId)
        if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND || foundBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundBlog
        }
        const sortingPaginationProcessed: SortingPaginationProcessed = sortingPaginationService.processingSortPag(query)
        const postsDbOutput: PostsDbOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPostsByBlogId(blogId, sortingPaginationProcessed)
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
    },
    _mapBlogToOutput(blog: Blog): BlogOutput {
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }
    }
}
export default blogsService;