import postsRepository from "../repositories/postsRepository";
import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES, SERVICE_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import sortingPaginationService from "../libs/common/services/sortingPaginationService";
import commentsRepository from "../repositories/commentsRepository";
import {CommentDb, CommentInput, CommentOutput, CountAndCommentsDB, OutputPagesComments} from "../libs/types/commentsTypes";
import {randomUUID} from "crypto";
import usersRepository from "../repositories/usersRepository";
import {User} from "../libs/types/usersTypes";

const commentsService = {
    async getCommentById(id: string): Promise<CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundComment: CommentDb | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await commentsRepository.getCommentById(id);
        if (foundComment === REPOSITORY_RESPONSES.NOT_FOUND || foundComment === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundComment;
        }
        return this._mapCommentToOutput(foundComment);
    },
    async updateComment(commentId: string, commentBody: CommentInput, userId: string): Promise<SERVICE_RESPONSES.FORBIDDEN | REPOSITORY_RESPONSES> {
        const foundComment: CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await commentsRepository.getCommentById(commentId);
        if (foundComment === REPOSITORY_RESPONSES.NOT_FOUND || foundComment === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundComment;
        }
        if (foundComment.commentatorInfo.userId !== userId) {
            return SERVICE_RESPONSES.FORBIDDEN;
        }
        return await commentsRepository.updateComment(commentId, commentBody.content);
    },
    async deleteComment(commentId: string, userId: string): Promise<SERVICE_RESPONSES.FORBIDDEN | REPOSITORY_RESPONSES> {
        const foundComment: CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await commentsRepository.getCommentById(commentId);
        if (foundComment === REPOSITORY_RESPONSES.NOT_FOUND || foundComment === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundComment;
        }
        if (foundComment.commentatorInfo.userId !== userId) {
            return SERVICE_RESPONSES.FORBIDDEN;
        }
        return await commentsRepository.deleteComment(commentId);

    },
    async getCommentsByPostId(postId: string, query: SortingPaginationQuery): Promise<OutputPagesComments | REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND> {
        const foundPost: Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPostById(postId);
        if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND || foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return foundPost;
        }
        const sortingPaginationProcessed: SortingPaginationProcessed = sortingPaginationService.processingSortPag(query, "comments");
        const commentsAndCount: REPOSITORY_RESPONSES.UNSUCCESSFULLY | CountAndCommentsDB = await commentsRepository.getCommentsByPostId(postId, sortingPaginationProcessed);
        if (commentsAndCount === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return commentsAndCount;
        }
        const commentsOutput: CommentOutput[] = commentsAndCount.foundComments.map(comment => this._mapCommentToOutput(comment));
        return {
            pagesCount: Math.ceil(commentsAndCount.totalCount / sortingPaginationProcessed.pagination.pageSize),
            page: sortingPaginationProcessed.pagination.pageNumber,
            pageSize: sortingPaginationProcessed.pagination.pageSize,
            totalCount: commentsAndCount.totalCount,
            items: commentsOutput
        };
    },
    async createComment(postId: string, commentBody: CommentInput, userId: string): Promise<CommentOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const foundPost: Post | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await postsRepository.getPostById(postId);
        const foundUser: User | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersRepository.getUserById(userId);
        if (foundPost === REPOSITORY_RESPONSES.NOT_FOUND || foundUser === REPOSITORY_RESPONSES.NOT_FOUND) {
            return REPOSITORY_RESPONSES.NOT_FOUND;
        }
        if (foundPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY || foundUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
        const newComment: CommentDb = {
            id: randomUUID(),
            content: commentBody.content,
            postId,
            commentatorInfo: {
                userId,
                userLogin: foundUser.login
            },
            createdAt: new Date().toISOString(),
        };
        const createdResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await commentsRepository.createComment(newComment);
        if (createdResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return createdResult;
        }
        return {
            id: newComment.id,
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt
        };
    },
    _mapCommentToOutput(comment: CommentDb): CommentOutput {
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
        };
    }
};
export default commentsService;