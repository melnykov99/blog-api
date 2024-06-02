import express, {Response} from "express";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import blogsService from "../services/blogsService";
import {BlogInput, BlogOutput, OutputPagesBlogs} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import authBasicMiddleware from "../libs/middlewares/authBasicMiddleware";
import blogsValidationChain from "../libs/validations/blogsValidation";
import validationErrorCheck from "../libs/validations/validationErrorCheck";
import {PostInputWithoutBlog, OutputPagesPosts, PostOutput} from "../libs/types/postsTypes";
import {postsForBlogValidationChain} from "../libs/validations/postsValidation";
import {SortingPaginationQuery} from "../libs/types/commonTypes";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../libs/types/requestsResponsesTypes";

const blogsRouter = express.Router();
blogsRouter.get("/", async (req: RequestWithQuery<SortingPaginationQuery>, res: Response<OutputPagesBlogs>) => {
    const foundBlogs: OutputPagesBlogs | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.getBlogs(req.query);
    if (foundBlogs === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.status(HTTP_STATUSES.OK).send(foundBlogs);
});
blogsRouter.post("/", authBasicMiddleware, blogsValidationChain, validationErrorCheck, async (req: RequestWithBody<BlogInput>, res: Response<BlogOutput>) => {
    const createdBlog: BlogOutput | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.createBlog(req.body);
    if (createdBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.status(HTTP_STATUSES.CREATED).send(createdBlog);
});
blogsRouter.get("/:id", async (req: RequestWithParams<{id: string}>, res: Response<BlogOutput>) => {
    const blogId: string = req.params.id;
    const foundBlog: BlogOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.getBlogById(blogId);
    if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (foundBlog === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.status(HTTP_STATUSES.OK).send(foundBlog);
});
blogsRouter.put("/:id", authBasicMiddleware, blogsValidationChain, validationErrorCheck, async (req: RequestWithParamsAndBody<{id: string}, BlogInput>, res: Response) => {
    const blogId: string = req.params.id;
    const updatingResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.updateBlog(blogId, req.body);
    if (updatingResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (updatingResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
blogsRouter.delete("/:id", authBasicMiddleware, async (req: RequestWithParams<{id: string}>, res: Response) => {
    const blogId: string = req.params.id;
    const deletionResult: REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.deleteBlog(blogId);
    if (deletionResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (deletionResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
// Получение постов, относящихся к конкретному блогу
blogsRouter.get("/:id/posts", async (req: RequestWithParamsAndQuery<{id: string}, SortingPaginationQuery>, res: Response<OutputPagesPosts>) => {
    const blogId: string = req.params.id;
    const posts: OutputPagesPosts | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.getPostsByBlogId(blogId, req.query);
    if (posts === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (posts === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.status(HTTP_STATUSES.OK).send(posts);
});
// Создание поста для конкретного блога
blogsRouter.post("/:id/posts", authBasicMiddleware, postsForBlogValidationChain, validationErrorCheck, async (req: RequestWithParamsAndBody<{id: string}, PostInputWithoutBlog>, res: Response<PostOutput>) => {
    const blogId: string = req.params.id;
    const createdPost: PostOutput | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await blogsService.createPostByBlogId(blogId, req.body);
    if (createdPost === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }
    if (createdPost === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
        return;
    }
    res.status(HTTP_STATUSES.CREATED).send(createdPost);
});

export default blogsRouter;