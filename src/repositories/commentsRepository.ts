import {SortingPaginationProcessed} from "../libs/types/commonTypes";
import {commentsCollection} from "./dbConfig";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {CommentDb, CommentOutput, CommentsDbFilterByPostId, CountAndCommentsDB} from "../libs/types/commentsTypes";
import {DeleteResult, UpdateResult} from "mongodb";

const commentsRepository = {
    async getCommentById(id: string): Promise<CommentDb | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundComment: CommentDb | null = await commentsCollection.findOne({id: id});
            if (!foundComment) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundComment
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async updateComment(id: string, updatedContent: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const updatingResult: UpdateResult = await commentsCollection.updateOne({id: id}, {$set: {content: updatedContent}})
            if (updatingResult.modifiedCount === 0) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async deleteComment(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const deletionResult: DeleteResult = await commentsCollection.deleteOne({id: id})
            if (deletionResult.deletedCount === 0) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async getCommentsByPostId(postId: string, sortingPaginationProcessed: SortingPaginationProcessed): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | CountAndCommentsDB> {
        try {
            const filter: CommentsDbFilterByPostId = {postId: postId}
            const totalCount: number = await commentsCollection.countDocuments(filter)
            const foundComments: CommentDb[] = await commentsCollection
                .find(filter)
                .sort({[sortingPaginationProcessed.sorting.sortBy]: sortingPaginationProcessed.sorting.sortDirection})
                .skip(sortingPaginationProcessed.dbProperties.skip)
                .limit(sortingPaginationProcessed.dbProperties.limit)
                .toArray()
            return {totalCount, foundComments}
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async createComment(newComment: CommentDb): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await commentsCollection.insertOne({...newComment})
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    }
}
export default commentsRepository;