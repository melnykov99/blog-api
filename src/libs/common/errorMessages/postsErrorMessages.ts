import {CommonError, ErrorsMessages} from "../../types/commonTypes";
import {PostFieldsForErrorMessages} from "../../types/postsTypes";

const fieldsMessages = {
    title: 'title must be string with maximum length 30 characters',
    shortDescription: 'shortDescription must be string with maximum length 100 characters',
    content: 'content must be string with maximum length 1000 characters',
    blogId: 'blogId must be string with existing blog id'
}

function draftPostErrorMessage(fields: PostFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (fieldsMessages[field]) {
            errorsMessages.push({field: field, message: fieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
export default draftPostErrorMessage;