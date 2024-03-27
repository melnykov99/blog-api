import {Post, PostsDbOutput, PostsOutput} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {postsCollection} from "./dbConfig";
import {UpdateResult} from "mongodb";
import {DbProperties} from "../libs/types/commonTypes";

const postsRepository = {
    async getPosts(dbProp: DbProperties): Promise<PostsDbOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const filter = {}
            const totalCount: number = await postsCollection.countDocuments(filter)
            const foundPosts: Post[] = await postsCollection.find(filter, {projection: {_id: false}}).skip(dbProp.skip).limit(dbProp.limit).toArray();
            return {totalCount, foundPosts}
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async createPost(newPost: Post): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await postsCollection.insertOne({...newPost})
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async getPostById(id: string): Promise<Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundPost: Post | null = await postsCollection.findOne({id: id}, {projection: {_id: false}});
            if (!foundPost) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundPost
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
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
            })
            if (updatedResult.matchedCount === 0) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async deletePost(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const deletionResult: Post | null = await postsCollection.findOneAndDelete({id: id});
            if (!deletionResult) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async getPostsByBlogId(blogId: string, dbProp: DbProperties): Promise<PostsDbOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const filter = {blogId: blogId}
            const totalCount: number = await postsCollection.countDocuments(filter)
            const foundPosts: Post[] = await postsCollection.find(filter).skip(dbProp.skip).limit(dbProp.limit).toArray()
            return {totalCount, foundPosts}
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    }
}
export default postsRepository;