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
}
type Pagination = {
    pageSize: number,
    pageNumber: number,
}
type DbProperties = {
    skip: number,
    limit: number,
}
export {CommonError, ErrorsMessages, SortingPaginationQuery, Pagination, DbProperties, SortingPaginationProcessed};