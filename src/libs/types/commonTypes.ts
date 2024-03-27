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
    searchNameTerm: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined,
}
type SortingPaginationProcessed = {
    dbProperties: DbProperties,
    pagination: Pagination,
    sorting: Sorting,
    searchNameTerm: SearchNameTerm,
}
type Pagination = {
    pageSize: number,
    pageNumber: number,
}
type Sorting = {
    sortBy: keyof Blog | keyof Post,
    sortDirection: 1 | -1,
}
type SearchNameTerm = string | null
type DbProperties = {
    skip: number,
    limit: number,
}
export {CommonError, ErrorsMessages, SortingPaginationQuery, Pagination, DbProperties, SortingPaginationProcessed, Sorting, SearchNameTerm};