import {CommonError, ErrorsMessages} from "../../types/commonTypes";
import {BlogFieldsForErrorMessages} from "../../types/blogsTypes";

const fieldsMessages = {
    name: 'name must be string with maximum length 15 characters',
    description: 'description must be string with maximum length 500 characters',
    websiteUrl: 'websiteUrl must be string with url format and maximum length 100 characters',
}
function draftBlogErrorMessage(fields: BlogFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (fieldsMessages[field]) {
            errorsMessages.push({field: field, message: fieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
export default draftBlogErrorMessage;