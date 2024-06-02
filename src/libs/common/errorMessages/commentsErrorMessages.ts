import {CommonError, ErrorsMessages} from "../../types/commonTypes";
import {CommentFieldsForErrorMessages} from "../../types/commentsTypes";

const fieldsMessages = {
    content: "content must be string from 20 to 300 characters",
};
function draftCommentErrorMessage(fields: CommentFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = [];
    fields.forEach(field => {
        if (fieldsMessages[field]) {
            errorsMessages.push({field: field, message: fieldsMessages[field]});
        }
    });
    return {errorsMessages};
}
export default draftCommentErrorMessage;