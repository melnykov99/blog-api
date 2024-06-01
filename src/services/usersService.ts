import {SortingPaginationProcessed, SortingPaginationQuery} from "../libs/types/commonTypes";
import usersRepository from "../repositories/usersRepository";
import sortingPaginationService from "../libs/common/services/sortingPaginationService";
import {User, UserInput, UserOutput, CountAndUsersDB, OutputPagesUsers} from "../libs/types/usersTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {randomUUID} from "crypto";
import bcrypt from 'bcrypt'
import {add} from 'date-fns'

const usersService = {
    async getUsers(query: SortingPaginationQuery): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | OutputPagesUsers> {
        const sortingPaginationProcessed: SortingPaginationProcessed = sortingPaginationService.processingSortPag(query, 'users')
        const usersAndCount: CountAndUsersDB | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await usersRepository.getUsers(sortingPaginationProcessed)
        if (usersAndCount === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return usersAndCount
        }
        //Мапим, убирая лишние значения, которые пришли из БД. Оставляем только то, что можно выводить в ответе
        const usersOutput: UserOutput[] = usersAndCount.foundUsers.map(user => this._mapUserToOutput(user))
        return {
            pagesCount: Math.ceil(usersAndCount.totalCount / sortingPaginationProcessed.pagination.pageSize),
            page: sortingPaginationProcessed.pagination.pageNumber,
            pageSize: sortingPaginationProcessed.pagination.pageSize,
            totalCount: usersAndCount.totalCount,
            items: usersOutput
        }
    },
    // Создание юзера вызванное регистрацией. Юзер не подтвержден
    async createUser(bodyUser: UserInput, confirmationCode: string): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const newUser: User = {
            id: randomUUID(),
            login: bodyUser.login,
            email: bodyUser.email,
            hash: await this._passwordHash(bodyUser.password),
            createdAt: new Date().toISOString(),
            confirmationCode: confirmationCode,
            codeExpirationDate: add(new Date(), {hours: 24}),
            isConfirmed: false,
        }
        return await usersRepository.createUser(newUser);
    },
    // Ручное создание пользователя. Пользователь сразу считается подтвержденным.
    async manualCreateUser(bodyUser: UserInput): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | UserOutput> {
        const newUser: User = {
            id: randomUUID(),
            login: bodyUser.login,
            email: bodyUser.email,
            hash: await this._passwordHash(bodyUser.password),
            createdAt: new Date().toISOString(),
            confirmationCode: null,
            codeExpirationDate: null,
            isConfirmed: true,
        }
        const createdResult: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY = await usersRepository.createUser(newUser)
        if (createdResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        return {id: newUser.id, login: newUser.login, email: newUser.email, createdAt: newUser.createdAt}
    },
    async deleteUser(id: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await usersRepository.deleteUser(id)
    },
    async confirmUser(code: string): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY> {
        return await usersRepository.confirmUser(code)
    },
    async updateConfirmationCodeAndExpDate(userEmail: string, newCode: string): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const newCodeExpirationDate: Date = add(new Date(), {hours: 24});
        return await usersRepository.updateConfirmationCodeAndExpDate(userEmail, newCode, newCodeExpirationDate)
    },
    async _passwordHash(password: string): Promise<string> {
        let userHash: string = '';
        await bcrypt.hash(password, 10).then(hash => {
            userHash = hash
        }).catch(err => console.error(err.message))
        return userHash;
    },
    _mapUserToOutput(user: User): UserOutput {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }
    },
}
export default usersService;