import {Blog} from "./blogsTypes";
import {Post} from "./postsTypes";

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
    // Общие
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined,
}
type SortingPaginationProcessed = {
    dbProperties: DbProperties,
    pagination: Pagination,
    sorting: Sorting,
    searchNameTerm?: SearchNameTerm,
    searchLoginTerm?: SearchLoginTerm,
    searchEmailTerm?: SearchEmailTerm,
}
type Pagination = {
    pageSize: number,
    pageNumber: number,
}
type Sorting = {
    sortBy: keyof Blog | keyof Post,
    sortDirection: 1 | -1,
}
// Используется в запросе /blogs
type SearchNameTerm = string | null | undefined
// Используется в запросе /users
type SearchLoginTerm = string | null | undefined
type SearchEmailTerm = string | null | undefined

type DbProperties = {
    skip: number,
    limit: number,
}
export {CommonError, ErrorsMessages, SortingPaginationQuery, Pagination, DbProperties, SortingPaginationProcessed, Sorting, SearchNameTerm, SearchLoginTerm, SearchEmailTerm};