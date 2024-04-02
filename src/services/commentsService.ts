import postsRepository from "../repositories/postsRepository";
import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import handlerSortingPagination from "../libs/common/utils/handlerSortingPagination";
import commentsRepository from "../repositories/commentsRepository";

const commentsService = {
    async getCommentById() {

    },
    async updateComment() {

    },
    async deleteComment() {

    },
    async getCommentsByPostId(postId: string, query: SortingPaginationQuery) {
        const foundPost: Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPostById(postId);
        if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND || foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundPost
        }
        const sortingPaginationProcessed: SortingPaginationProcessed = handlerSortingPagination(query);
        const commentsDbOutput = await commentsRepository.getCommentsByPostId(postId, sortingPaginationProcessed)
    },
    async createComment() {

    }
}
export default commentsService;