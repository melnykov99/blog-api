import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import usersRepository from "../repositories/usersRepository";
import handlerSortingPagination from "../libs/common/utils/handlerSortingPagination";

const usersService = {
    async getUsers(query: SortingPaginationQuery) {
        const sortingPaginationProcessed: SortingPaginationProcessed = handlerSortingPagination(query)
        const foundUsers = await usersRepository.getUsers(sortingPaginationProcessed)
    }
}
export default usersService;