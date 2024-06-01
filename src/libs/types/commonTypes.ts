import {Blog, BlogOutput} from "./blogsTypes";
import {Post, PostOutput} from "./postsTypes";
import {JwtPayload} from "jsonwebtoken";
import {CommentOutput} from "./commentsTypes";
import {UserOutput} from "./usersTypes";

type CommonError = {
    message: string,
    field: string
}
type ErrorsMessages = {
    errorsMessages: CommonError[]
}
type SortingPaginationQuery = {
    // Используется в запросе /blogs
    searchNameTerm?: string | undefined,
    // Используется в запросе /users
    searchLoginTerm?: string | undefined,
    searchEmailTerm?: string | undefined,
    // Общие ключи сортировки и пагинации
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined,
}
// Объект с обработанными данными сортировки для дальнейшей передачи в repository и работы с mongodb
type SortingPaginationProcessed = {
    dbProperties: DbProperties,
    pagination: Pagination,
    sorting: Sorting,
    searchParams: {searchNameTerm?: SearchNameTerm, searchLoginTerm?: SearchLoginTerm, searchEmailTerm?: SearchEmailTerm}
}
type Pagination = {
    pageSize: number,
    pageNumber: number,
}
type Sorting = {
    sortBy: keyof BlogOutput | keyof PostOutput | keyof CommentOutput | keyof UserOutput,
    sortDirection: 1 | -1,
}
// Используется в запросе /blogs
type SearchNameTerm = string | undefined
// Используется в запросе /users
type SearchLoginTerm = string | undefined
type SearchEmailTerm = string | undefined

// Свойства для find запроса в mongodb
type DbProperties = {
    skip: number,
    limit: number,
}

type ServiceForSortingPagination = 'blogs' | 'posts' | 'comments' | 'users';

// Интерфейс, расширяющий стандартный тип JwtPayload, добавляем в него свойства userId и deviceId
interface CustomJwtPayload extends JwtPayload {
    userId: string;
    deviceId?: string;
}

export {CommonError, ErrorsMessages, SortingPaginationQuery, Pagination, DbProperties, SortingPaginationProcessed, Sorting, SearchNameTerm, SearchLoginTerm, SearchEmailTerm, CustomJwtPayload, ServiceForSortingPagination};