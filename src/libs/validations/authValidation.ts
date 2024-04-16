import {body, ValidationChain} from "express-validator";
import {User} from "../types/usersTypes";
import usersRepository from "../../repositories/usersRepository";
import {REPOSITORY_RESPONSES} from "../common/constants/repositoryResponse";

const authLoginValidation: ValidationChain[] = [
    body('loginOrEmail').isString().bail().trim().notEmpty().bail().isLength({min: 3, max: 10000}),
    body('password').isString().bail().trim().notEmpty().bail().isLength({min: 6, max: 20}),
]

const authRegistrationValidation: ValidationChain[] = [
    //TODO: возвращаем одну и ту же ошибку при неправильном формате login/email и если юзер с таким login/email уже существует. Разделить нужно
    body('login').isString().bail().trim().notEmpty().bail().isLength({
        min: 3,
        max: 10
    }).bail().matches(/^[a-zA-Z0-9_-]*$/).custom(async (login, {req}) => {
        const foundUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User = await usersRepository.getUserByLoginOrEmail(login)
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND) {
            return true
        }
        throw new Error();
    }),
    body('email').isString().bail().trim().notEmpty().bail().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).bail().custom(async (email, {req}) => {
        const foundUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User = await usersRepository.getUserByLoginOrEmail(email)
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND) {
            return true
        }
        throw new Error();
    }),
    body('password').isString().bail().trim().notEmpty().bail().isLength({min: 6, max: 20}),
]

const authRegistrationConfirmationValidation: ValidationChain[] = [
    //TODO: Возможно стоит всегда проверять на какую-то максимальную длину, чтобы не прислали тяжелый код и мы не нагрузили себе БД
    body('code').isString().bail().trim().notEmpty().bail().custom(async (code, {req}) => {
        const foundUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User = await usersRepository.getUserByConfirmationCode(code)
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND || foundUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            throw new Error();
        }
        if (foundUser.codeExpirationDate === null || foundUser.codeExpirationDate < new Date()) {
            throw new Error();
        }
        return true
    }),
]

const authRegistrationEmailResendingValidation: ValidationChain[] = [
    body('email').isString().bail().trim().notEmpty().bail().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).bail().custom(async (email, {req}) => {
        const foundUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User = await usersRepository.getUserByLoginOrEmail(email)
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND || foundUser === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            throw new Error();
        }
        if (foundUser.isConfirmed) {
            throw new Error();
        }
        return true
    })
]
export {authLoginValidation, authRegistrationValidation, authRegistrationConfirmationValidation, authRegistrationEmailResendingValidation}