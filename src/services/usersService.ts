import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import usersRepository from "../repositories/usersRepository";
import handlerSortingPagination from "../libs/common/utils/handlerSortingPagination";
import {UsersDbOutput, UsersOutput} from "../libs/types/usersTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";

const usersService = {
    async getUsers(query: SortingPaginationQuery): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | UsersOutput> {
        const sortingPaginationProcessed: SortingPaginationProcessed = handlerSortingPagination(query)
        const usersDbOutput: UsersDbOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersRepository.getUsers(sortingPaginationProcessed)
        if (usersDbOutput === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return usersDbOutput
        }
        return {
            pagesCount: Math.ceil(usersDbOutput.totalCount / sortingPaginationProcessed.pagination.pageSize),
            page: sortingPaginationProcessed.pagination.pageNumber,
            pageSize: sortingPaginationProcessed.pagination.pageSize,
            totalCount: usersDbOutput.totalCount,
            items: usersDbOutput.foundUsers
        }
    }
}
export default usersService;