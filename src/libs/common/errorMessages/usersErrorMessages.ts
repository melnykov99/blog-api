import {CommonError, ErrorsMessages} from "../../types/commonTypes";
import {UserFieldsForErrorMessages} from "../../types/usersTypes";

const fieldsMessages = {
    login: 'login must be string from 3 to 10 characters and must fit the pattern ^[a-zA-Z0-9_-]*$',
    password: 'password must be string from 6 to 20 characters',
    email: 'email must be string email format',
}
function draftUserErrorMessage(fields: UserFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (fieldsMessages[field]) {
            errorsMessages.push({field: field, message: fieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
export default draftUserErrorMessage;