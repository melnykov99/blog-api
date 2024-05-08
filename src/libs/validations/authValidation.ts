import {body, ValidationChain} from "express-validator";
import {User} from "../types/usersTypes";
import usersRepository from "../../repositories/usersRepository";
import {REPOSITORY_RESPONSES} from "../common/constants/repositoryResponse";
import {COMMON_LIMITS, LOGIN_LIMITS, PASSWORD_LIMITS} from "../common/constants/characterLimits";

const authLoginValidation: ValidationChain[] = [
    //ограничение в 5000 символов для защиты добавлено
    body('loginOrEmail').isString().bail().trim().notEmpty().bail().isLength({
        max: COMMON_LIMITS.MAX
    }),
    body('password').isString().bail().trim().notEmpty().bail().isLength({
        min: PASSWORD_LIMITS.MIN,
        max: PASSWORD_LIMITS.MAX
    }),
]

const authRegistrationValidation: ValidationChain[] = [
    //Проверка login по формату и что юзера с таким логином еще не существует. Если существует, то вернем ошибку
    body('login').isString().bail().trim().notEmpty().bail().isLength({
        min: LOGIN_LIMITS.MIN,
        max: LOGIN_LIMITS.MAX
    }).bail().matches(/^[a-zA-Z0-9_-]*$/).custom(async (login, {req}) => {
        const foundUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User = await usersRepository.getUserByLoginOrEmail(login)
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND) {
            return true
        }
        throw new Error();
    }),
    //Проверка email по формату и что юзера с таким email-ом еще не существует. Если существует, то вернем ошибку
    body('email').isString().bail().trim().notEmpty().bail().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).bail().isLength({
        max: COMMON_LIMITS.MAX
    }).custom(async (email, {req}) => {
        const foundUser: REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | User = await usersRepository.getUserByLoginOrEmail(email)
        if (foundUser === REPOSITORY_RESPONSES.NOT_FOUND) {
            return true
        }
        throw new Error();
    }),
    body('password').isString().bail().trim().notEmpty().bail().isLength({min: 6, max: 20}),
]

const authRegistrationConfirmationValidation: ValidationChain[] = [
    //TODO: возвращаем одну и ту же ошибку при неправильном формате code и если code уже истек. Нужно разделить
    //Проверка кода подтверждения. Если у найденного по коду юзера в codeExpirationDate null значит он уже должен быть подтвержден
    //Если у найденного юзера codeExpirationDate меньше текущей даты, значит срок действия кода истек и нужно запросить новый
    body('code').isString().bail().trim().notEmpty().bail().isLength({
        max: COMMON_LIMITS.MAX
    }).custom(async (code, {req}) => {
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
    //TODO: возвращаем одну и ту же ошибку при неправильном формате email и если юзер с таким email уже подтвержден, если он не найден. Нужно разделить.
    //Проверка email при запросе повторной отправки кода подтверждения. Возвращаем ошибку, если юзер с таким email не найден или он уже подтвержден
    body('email').isString().bail().trim().notEmpty().bail().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).bail().isLength({
        max: COMMON_LIMITS.MAX
    }).custom(async (email, {req}) => {
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
export {
    authLoginValidation,
    authRegistrationValidation,
    authRegistrationConfirmationValidation,
    authRegistrationEmailResendingValidation
}