import {CommonError, ErrorsMessages} from "../../types/commonTypes";
import {AuthLoginFieldsForErrorMessages, AuthRegistrationFieldsForErrorMessages} from "../../types/authTypes";

const fieldsMessages = {
    loginOrEmail: 'loginOrEmail must be string and contain login or email',
    login: 'login must be string from 3 to 10 characters and must fit the pattern ^[a-zA-Z0-9_-]*$. A user with that login address should not exist',
    password: 'password must be string from 6 to 20 characters',
    email: 'email must be string email format. A user with that email address should not exist',
}
function draftAuthErrorMessage(fields: AuthLoginFieldsForErrorMessages[] | AuthRegistrationFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (fieldsMessages[field]) {
            errorsMessages.push({field: field, message: fieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
export default draftAuthErrorMessage;