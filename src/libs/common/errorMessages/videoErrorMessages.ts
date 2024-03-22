import {VideoFieldsForErrorMessages} from "../../types/videosTypes";
import {CommonError, ErrorsMessages} from "../../types/commonTypes";

const fieldsMessages = {
    title: 'title must be string with maximum length 40 characters',
    author: 'author must be string with maximum length 20 characters',
    availableResolutions: 'availableResolutions must be array with values according to the documentation',
    canBeDownloaded: 'canBeDownloaded must be boolean',
    minAgeRestriction: 'must be number with values according to the documentation',
    publicationDate: 'publicationDate must be string in ISO 8601 format'
}

function draftVideoErrorMessage(fields: VideoFieldsForErrorMessages[]): ErrorsMessages {
    const errorsMessages: CommonError[] = []
    fields.forEach(field => {
        if (fieldsMessages[field]) {
            errorsMessages.push({field: field, message: fieldsMessages[field]})
        }
    })
    return {errorsMessages}
}
export default draftVideoErrorMessage;