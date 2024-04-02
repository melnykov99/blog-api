import {CommonError, ErrorsMessages} from "../../types/commonTypes";
import {AuthLoginFieldsForErrorMessages} from "../../types/authTypes";

const fieldsMessages = {
    loginOrEmail: 'loginOrEmail must be string and contain login or email',
    password: 'password must be string from 6 to 20 characters',
}
function draftAuthErrorMessage(fields: AuthLoginFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (fieldsMessages[field]) {
            errorsMessages.push({field: field, message: fieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
export default draftAuthErrorMessage;