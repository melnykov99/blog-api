import {SortingPaginationProcessed} from "../libs/types/commonTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User, UsersDbFilter, UsersDbOutput} from "../libs/types/usersTypes";
import {usersCollection} from "./dbConfig";

const usersRepository = {
    async getUsers(sortingPaginationProcessed: SortingPaginationProcessed): Promise<UsersDbOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            //TODO: этот страх  нужно вынести отдельно куда-то. У blogs возможно тоже
            const filter: UsersDbFilter =
                (sortingPaginationProcessed.searchParams.searchLoginTerm && sortingPaginationProcessed.searchParams.searchEmailTerm)
                    ? {
                        login: {$regex: sortingPaginationProcessed.searchParams.searchLoginTerm, $options: 'i'},
                        email: {$regex: sortingPaginationProcessed.searchParams.searchEmailTerm, $options: 'i'}
                    }
                    : (sortingPaginationProcessed.searchParams.searchLoginTerm && !sortingPaginationProcessed.searchParams.searchEmailTerm)
                        ? {login: {$regex: sortingPaginationProcessed.searchParams.searchLoginTerm, $options: 'i'}}
                        : (!sortingPaginationProcessed.searchParams.searchLoginTerm && sortingPaginationProcessed.searchParams.searchEmailTerm)
                            ? {email: {$regex: sortingPaginationProcessed.searchParams.searchEmailTerm, $options: 'i'}}
                            : {}
            const totalCount: number = await usersCollection.countDocuments(filter)
            const foundUsers: User[] = await usersCollection
                .find(filter, {projection: {_id: false}})
                .sort({[sortingPaginationProcessed.sorting.sortBy]: sortingPaginationProcessed.sorting.sortDirection})
                .skip(sortingPaginationProcessed.dbProperties.skip)
                .limit(sortingPaginationProcessed.dbProperties.limit)
                .toArray()
            return {totalCount, foundUsers}
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    }
}
export default usersRepository;