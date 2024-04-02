import {SortingPaginationProcessed} from "../libs/types/commonTypes";
import {commentsCollection, postsCollection} from "./dbConfig";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {Commentary, CommentsDbFilterByPostId} from "../libs/types/commentsTypes";

const commentsRepository = {
    async getCommentById() {

    },
    async updateComment() {

    },
    async deleteComment() {

    },
    async getCommentsByPostId(postId: string, sortingPaginationProcessed: SortingPaginationProcessed) {
        try {
            const filter: CommentsDbFilterByPostId = {postId: postId}
            const totalCount: number = await commentsCollection.countDocuments(filter)
            const foundComments: Commentary[] = await commentsCollection
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