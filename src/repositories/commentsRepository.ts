import {SortingPaginationProcessed} from "../libs/types/commonTypes";
import {commentsCollection, postsCollection} from "./dbConfig";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {CommentOutput, CommentsDbFilterByPostId} from "../libs/types/commentsTypes";

const commentsRepository = {
    async getCommentById(id: string): Promise<CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundComment: CommentOutput | null = await commentsCollection.findOne({id: id}, {projection: {_id: false, postId: false}});
            if (!foundComment) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundComment
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async updateComment() {

    },
    async deleteComment() {

    },
    async getCommentsByPostId(postId: string, sortingPaginationProcessed: SortingPaginationProcessed) {
        try {
            const filter: CommentsDbFilterByPostId = {postId: postId}
            const totalCount: number = await commentsCollection.countDocuments(filter)
            const foundComments: CommentOutput[] = await commentsCollection
                .find(filter, {projection: {_id: false, postId: false}})
                .sort({[sortingPaginationProcessed.sorting.sortBy]: sortingPaginationProcessed.sorting.sortDirection})
                .skip(sortingPaginationProcessed.dbProperties.skip)
                .limit(sortingPaginationProcessed.dbProperties.limit)
                .toArray()
            return {totalCount, foundComments}
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async createComment(){

    }
}
export default commentsRepository;