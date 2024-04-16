import {CommonError, ErrorsMessages} from "../../types/commonTypes";
import {
    AuthLoginFieldsForErrorMessages,
    AuthRegistrationConfirmationFieldsForErrorMessages, AuthRegistrationEmailResendingFieldsForErrorMessages,
    AuthRegistrationFieldsForErrorMessages
} from "../../types/authTypes";

const loginFieldsMessages = {
    loginOrEmail: 'loginOrEmail must be string and contain login or email',
    password: 'password must be string from 6 to 20 characters',
}
const registrationFieldsMessages = {
    login: 'login must be string from 3 to 10 characters and must fit the pattern ^[a-zA-Z0-9_-]*$. A user with that login should not exist',
    email: 'email must be string email format. A user with that email should not exist',
    password: 'password must be string from 6 to 20 characters',
}
const registrationConfirmationFieldsMessages = {
    code: 'incorrect code. Either it has expired or the user has already been confirmed.',
}
const registrationEmailResendingFieldsMessages = {
    email: 'email must be string email format. A user with that email must exist and not yet be confirmed'
}
function draftAuthLoginErrorMessage(fields: AuthLoginFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (loginFieldsMessages[field]) {
            errorsMessages.push({field: field, message: loginFieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
function draftAuthRegistrationErrorMessage(fields: AuthRegistrationFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (registrationFieldsMessages[field]) {
            errorsMessages.push({field: field, message: registrationFieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
function draftAuthRegistrationConfirmationErrorMessage(fields: AuthRegistrationConfirmationFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (registrationConfirmationFieldsMessages[field]) {
            errorsMessages.push({field: field, message: registrationConfirmationFieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
function draftAuthRegistrationEmailResendingErrorMessage(fields: AuthRegistrationEmailResendingFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (registrationEmailResendingFieldsMessages[field]) {
            errorsMessages.push({field: field, message: registrationEmailResendingFieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
export {draftAuthLoginErrorMessage, draftAuthRegistrationErrorMessage, draftAuthRegistrationConfirmationErrorMessage, draftAuthRegistrationEmailResendingErrorMessage};