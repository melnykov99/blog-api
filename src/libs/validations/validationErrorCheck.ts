import {NextFunction, Request, Response} from "express";
import {Result, ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import draftBlogErrorMessage from "../common/errorMessages/blogsErrorMessages";
import {BlogFieldsForErrorMessages} from "../types/blogsTypes";
import {PostFieldsForErrorMessages} from "../types/postsTypes";
import draftPostErrorMessage from "../common/errorMessages/postsErrorMessages";

function validationErrorCheck(req: Request, res: Response, next: NextFunction) {
    const result: Result<ValidationError> = validationResult(req)
    let errorsMessages; // type :ErrorsMessages
    let convertedErrorFields; //type <BlogFieldsForErrorMessages | PostFieldsForErrorMessages>
    if (!result.isEmpty()) {
        const errorFields: string[] = Object.keys(result.mapped())
        switch (req.baseUrl){
            case '/blogs':
                convertedErrorFields = errorFields.map(field => field as BlogFieldsForErrorMessages);
                errorsMessages = draftBlogErrorMessage(convertedErrorFields);
                break;
            case '/posts':
                convertedErrorFields = errorFields.map(field => field as PostFieldsForErrorMessages);
                errorsMessages = draftPostErrorMessage(convertedErrorFields)
                break;
        }
        res.status(HTTP_STATUSES.BAD_REQUEST).send(errorsMessages)
        return
    }
    next()
}

export default validationErrorCheck;