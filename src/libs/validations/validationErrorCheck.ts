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
        // При создании блога попадаем в этот if
        if (req.baseUrl === '/blogs' && req.path === '/') {
            convertedErrorFields = errorFields.map(field => field as BlogFieldsForErrorMessages);
            errorsMessages = draftBlogErrorMessage(convertedErrorFields);
        }
        // Сюда попадем при создании post по blogId. Тогда req.path === /:blogId/posts
        // Или при обычном создании post
        if (req.baseUrl === '/blogs' && req.path !== '/' || req.baseUrl === '/posts') {
            convertedErrorFields = errorFields.map(field => field as PostFieldsForErrorMessages);
            errorsMessages = draftPostErrorMessage(convertedErrorFields)
        }
        res.status(HTTP_STATUSES.BAD_REQUEST).send(errorsMessages)
        return
    }
    next()
}

export default validationErrorCheck;