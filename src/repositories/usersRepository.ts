import {SortingPaginationProcessed} from "../libs/types/commonTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {User, UsersDbFilter, UsersFoundDB} from "../libs/types/usersTypes";
import {usersCollection} from "./dbConfig";
import filterService from "../libs/common/services/filterService";

const usersRepository = {
    async getUsers(sortingPaginationProcessed: SortingPaginationProcessed): Promise<UsersFoundDB | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const filter: UsersDbFilter = filterService.filterForUsers(sortingPaginationProcessed.searchParams.searchLoginTerm, sortingPaginationProcessed.searchParams.searchEmailTerm)
            const totalCount: number = await usersCollection.countDocuments(filter)
            const foundUsers: User[] = await usersCollection
                .find(filter)
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