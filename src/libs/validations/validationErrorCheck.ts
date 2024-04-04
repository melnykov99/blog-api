import {NextFunction, Request, Response} from "express";
import {Result, ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import draftBlogErrorMessage from "../common/errorMessages/blogsErrorMessages";
import {BlogFieldsForErrorMessages} from "../types/blogsTypes";
import {PostFieldsForErrorMessages} from "../types/postsTypes";
import draftPostErrorMessage from "../common/errorMessages/postsErrorMessages";
import {UserFieldsForErrorMessages} from "../types/usersTypes";
import draftUserErrorMessage from "../common/errorMessages/usersErrorMessages";
import {AuthLoginFieldsForErrorMessages} from "../types/authTypes";
import draftAuthErrorMessage from "../common/errorMessages/authErrorMessages";
import {CommentFieldsForErrorMessages} from "../types/commentsTypes";
import draftCommentErrorMessage from "../common/errorMessages/commentsErrorMessages";

function validationErrorCheck(req: Request, res: Response, next: NextFunction) {
    const result: Result<ValidationError> = validationResult(req)
    //TODO: для errorsMessages и convertedErrorField надо типы задать как-то
    let errorsMessages; // type :ErrorsMessages
    let convertedErrorFields; //type <BlogFieldsForErrorMessages | PostFieldsForErrorMessages | UserFieldsForErrorMessages>
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
        if (req.baseUrl === '/users') {
            convertedErrorFields = errorFields.map(field => field as UserFieldsForErrorMessages);
            errorsMessages = draftUserErrorMessage(convertedErrorFields)
        }
        if (req.baseUrl === '/auth') {
            convertedErrorFields = errorFields.map(field => field as AuthLoginFieldsForErrorMessages);
            errorsMessages = draftAuthErrorMessage(convertedErrorFields)
        }
        // Сюда попадаем при создании comment по postId. Тогда req.path === /:postId/comments
        // Или при update comment. Тогда req.baseUrl === '/comments'
        if (req.baseUrl === '/posts' && req.path !== '/' || req.baseUrl === '/comments') {
            convertedErrorFields = errorFields.map(field => field as CommentFieldsForErrorMessages);
            errorsMessages = draftCommentErrorMessage(convertedErrorFields)
        }
        res.status(HTTP_STATUSES.BAD_REQUEST).send(errorsMessages)
        return
    }
    next()
}

export default validationErrorCheck;