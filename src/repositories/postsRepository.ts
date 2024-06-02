import {Post, PostsDbFilter, PostsDbFilterByBlogId, CountAndPostsDB} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {postsCollection} from "./dbConfig";
import {UpdateResult} from "mongodb";
import {SortingPaginationProcessed} from "../libs/types/commonTypes";

const postsRepository = {
    async getPosts(sortingPaginationProcessed: SortingPaginationProcessed): Promise<CountAndPostsDB | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const filter: PostsDbFilter = {};
            return await this._getAndSortingPosts(filter, sortingPaginationProcessed);
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async createPost(newPost: Post): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await postsCollection.insertOne({...newPost});
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async getPostById(id: string): Promise<Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundPost: Post | null = await postsCollection.findOne({id: id});
            if (!foundPost) {
                return REPOSITORY_RESPONSES.NOT_FOUND;
            }
            return foundPost;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async updatePost(updatedPost: Post): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND> {
        try {
            const updatedResult: UpdateResult<Post> = await postsCollection.updateOne({id: updatedPost.id}, {
                $set: {
                    title: updatedPost.title,
                    shortDescription: updatedPost.shortDescription,
                    content: updatedPost.content,
                    blogId: updatedPost.blogId,
                    blogName: updatedPost.blogName
                }
            });
            if (updatedResult.matchedCount === 0) {
                return REPOSITORY_RESPONSES.NOT_FOUND;
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async deletePost(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const deletionResult: Post | null = await postsCollection.findOneAndDelete({id: id});
            if (!deletionResult) {
                return REPOSITORY_RESPONSES.NOT_FOUND;
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async getPostsByBlogId(blogId: string, sortingPaginationProcessed: SortingPaginationProcessed): Promise<CountAndPostsDB | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const filter: PostsDbFilterByBlogId = {blogId: blogId};
            return await this._getAndSortingPosts(filter, sortingPaginationProcessed);
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async _getAndSortingPosts(filter: PostsDbFilter | PostsDbFilterByBlogId, sortingPaginationProcessed: SortingPaginationProcessed) {
        const totalCount: number = await postsCollection.countDocuments(filter);
        const foundPosts: Post[] = await postsCollection
            .find(filter)
            .sort({[sortingPaginationProcessed.sorting.sortBy]: sortingPaginationProcessed.sorting.sortDirection})
            .skip(sortingPaginationProcessed.dbProperties.skip)
            .limit(sortingPaginationProcessed.dbProperties.limit)
            .toArray();
        return {totalCount, foundPosts};
    },
};
export default postsRepository;