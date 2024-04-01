import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import usersRepository from "../repositories/usersRepository";
import handlerSortingPagination from "../libs/common/utils/handlerSortingPagination";
import {User, UserInput, UserOutput, UsersDbOutput, UsersOutput} from "../libs/types/usersTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {randomUUID} from "crypto";

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
    },
    async createUser(bodyUser: UserInput): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | UserOutput> {
        const newUser: User = {
            id: randomUUID(),
            login: bodyUser.login,
            email: bodyUser.email,
            hash: bodyUser.password,
            createdAt: new Date().toISOString()
        }
        const createdResult: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await usersRepository.createUser(newUser)
        if (createdResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return {id: newUser.id, login: newUser.login, email: newUser.email, createdAt: newUser.createdAt}
    },
    async deleteUser(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await usersRepository.deleteUser(id)
    }
}
export default usersService;