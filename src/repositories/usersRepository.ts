import {SortingPaginationProcessed} from "../libs/types/commonTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User, UsersDbFilter, UsersDbOutput} from "../libs/types/usersTypes";
import {usersCollection} from "./dbConfig";
import {UpdateResult} from "mongodb";

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
                //TODO: скорее всего не репозиторий должен заниматься тем, что ненужные данные убирает. Мб надо мапить в сервисе уже
                .find(filter, {projection: {_id: false, hash: false, confirmationCode: false, isConfirmed: false}})
                .sort({[sortingPaginationProcessed.sorting.sortBy]: sortingPaginationProcessed.sorting.sortDirection})
                .skip(sortingPaginationProcessed.dbProperties.skip)
                .limit(sortingPaginationProcessed.dbProperties.limit)
                .toArray()
            return {totalCount, foundUsers}
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async createUser(newUser: User): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await usersCollection.insertOne({...newUser})
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async deleteUser(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const deletionResult: User | null = await usersCollection.findOneAndDelete({id: id})
            if (deletionResult === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async getUserByLoginOrEmail(loginOrEmail: string): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User> {
        try {
            const foundUser: User | null = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
            if (foundUser === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundUser
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async getUserById(id: string): Promise<User | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundUser: User | null = await usersCollection.findOne({id: id})
            if (foundUser === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundUser
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async getUserByConfirmationCode(code: string): Promise<User | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundUser: User | null = await usersCollection.findOne({confirmationCode: code});
            if (foundUser === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundUser
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async confirmUser(code: string): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY> {
        try {
            await usersCollection.updateOne({confirmationCode: code}, {
                $set: {
                    isConfirmed: true,
                    confirmationCode: null,
                    codeExpirationDate: null,
                }
            });
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async updateConfirmationCodeAndExpDate(userEmail: string, newCode: string, newExpDate: Date): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await usersCollection.updateOne({email: userEmail}, {$set: {confirmationCode: newCode, codeExpirationDate: newExpDate}})
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
}
export default usersRepository;