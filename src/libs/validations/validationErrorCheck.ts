import {NextFunction, Request, Response} from "express";
import {Result, ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import draftBlogErrorMessage from "../common/errorMessages/blogsErrorMessages";
import {BlogFieldsForErrorMessages} from "../types/blogsTypes";
import {PostFieldsForErrorMessages} from "../types/postsTypes";
import draftPostErrorMessage from "../common/errorMessages/postsErrorMessages";
import {UserFieldsForErrorMessages} from "../types/usersTypes";
import draftUserErrorMessage from "../common/errorMessages/usersErrorMessages";
import {
    AuthLoginFieldsForErrorMessages,
    AuthRegistrationConfirmationFieldsForErrorMessages, AuthRegistrationEmailResendingFieldsForErrorMessages,
    AuthRegistrationFieldsForErrorMessages,
} from "../types/authTypes";
import {
    draftAuthLoginErrorMessage,
    draftAuthRegistrationConfirmationErrorMessage, draftAuthRegistrationEmailResendingErrorMessage,
    draftAuthRegistrationErrorMessage,
} from "../common/errorMessages/authErrorMessages";
import {CommentFieldsForErrorMessages} from "../types/commentsTypes";
import draftCommentErrorMessage from "../common/errorMessages/commentsErrorMessages";

function validationErrorCheck(req: Request, res: Response, next: NextFunction): void {
    // Результат валидации запроса
    const result: Result<ValidationError> = validationResult(req);
    // Сразу глобально объявляем errorsMessages и convertedErrorFields, в них будем вносить значение в каком-то из if-ов, если есть ошибки.
    let errorsMessages; // type :ErrorsMessages
    let convertedErrorFields;
    if (!result.isEmpty()) {
        // Мапим ключи из result, это ключи по которым ошибки в валидации возникли
        const errorFields: string[] = Object.keys(result.mapped());
        // POST /blogs ИЛИ PUT /blogs/:id
        if ((req.baseUrl === "/blogs" && req.path === "/") || (req.baseUrl === "/blogs" && req.route.path === "/:id")) {
            // Мапим errorFields, проверем что эти ключи соответвуют проверяемым в валидации ключам Blog
            convertedErrorFields = errorFields.map(field => field as BlogFieldsForErrorMessages);
            // Формируем errorMessage на основе ключей по которым возникла ошибка в валидации
            errorsMessages = draftBlogErrorMessage(convertedErrorFields);
        }
        // POST /blogs/:id/posts ИЛИ POST /posts ИЛИ PUT /posts/:id
        if ((req.baseUrl === "/blogs" && req.route.path === "/:id/posts") || (req.baseUrl === "/posts" && req.route.path === "/:id")) {
            convertedErrorFields = errorFields.map(field => field as PostFieldsForErrorMessages);
            errorsMessages = draftPostErrorMessage(convertedErrorFields);
        }
        if (req.baseUrl === "/users") {
            convertedErrorFields = errorFields.map(field => field as UserFieldsForErrorMessages);
            errorsMessages = draftUserErrorMessage(convertedErrorFields);
        }
        if (req.originalUrl === "/auth/login") {
            convertedErrorFields = errorFields.map(field => field as AuthLoginFieldsForErrorMessages);
            errorsMessages = draftAuthLoginErrorMessage(convertedErrorFields);
        }
        if (req.originalUrl === "/auth/registration") {
            convertedErrorFields = errorFields.map(field => field as AuthRegistrationFieldsForErrorMessages);
            errorsMessages = draftAuthRegistrationErrorMessage(convertedErrorFields);
        }
        if (req.originalUrl === "/auth/registration-confirmation") {
            convertedErrorFields = errorFields.map(field => field as AuthRegistrationConfirmationFieldsForErrorMessages);
            errorsMessages = draftAuthRegistrationConfirmationErrorMessage(convertedErrorFields);
        }
        if (req.originalUrl === "/auth/registration-email-resending") {
            convertedErrorFields = errorFields.map(field => field as AuthRegistrationEmailResendingFieldsForErrorMessages);
            errorsMessages = draftAuthRegistrationEmailResendingErrorMessage(convertedErrorFields);
        }
        // POST /posts/:postId/comments ИЛИ PUT /comments
        console.log(req.route)
        if ((req.baseUrl === "/posts" && req.route.path === "/:postId/comments") || req.baseUrl === "/comments") {
            convertedErrorFields = errorFields.map(field => field as CommentFieldsForErrorMessages);
            errorsMessages = draftCommentErrorMessage(convertedErrorFields);
        }
        res.status(HTTP_STATUSES.BAD_REQUEST).send(errorsMessages);
        return;
    }
    next();
}

export default validationErrorCheck;