import postsRepository from "../repositories/postsRepository";
import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import handlerSortingPagination from "../libs/common/utils/handlerSortingPagination";
import commentsRepository from "../repositories/commentsRepository";
import {CommentOutput, CommentsDbOutput, CommentsOutput} from "../libs/types/commentsTypes";

const commentsService = {
    async getCommentById(id: string): Promise<CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return commentsRepository.getCommentById(id)
    },
    async updateComment() {

    },
    async deleteComment() {

    },
    async getCommentsByPostId(postId: string, query: SortingPaginationQuery): Promise<CommentsOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND> {
        const foundPost: Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPostById(postId);
        if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND || foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundPost
        }
        const sortingPaginationProcessed: SortingPaginationProcessed = handlerSortingPagination(query);
        const commentsDbOutput: REPOSITORY_RESPONSES.UNSUCCESSFULLY | CommentsDbOutput = await commentsRepository.getCommentsByPostId(postId, sortingPaginationProcessed);
        if (commentsDbOutput === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return commentsDbOutput
        }
        return {
            pagesCount: Math.ceil(commentsDbOutput.totalCount / sortingPaginationProcessed.pagination.pageSize),
            page: sortingPaginationProcessed.pagination.pageNumber,
            pageSize: sortingPaginationProcessed.pagination.pageSize,
            totalCount: commentsDbOutput.totalCount,
            items: commentsDbOutput.foundComments
        }
    },
    async createComment() {

    }
}
export default commentsService;