import {DbProperties, Pagination, SortingPaginationProcessed, SortingPaginationQuery} from "../../types/commonTypes";

function handlerSortingPagination(query: SortingPaginationQuery): SortingPaginationProcessed {
    const pagination: Pagination = {
        pageSize: query.pageSize === undefined ? 10 : Number(query.pageSize),
        pageNumber: query.pageNumber === undefined ? 1 : Number(query.pageNumber)
    }
    const skip: number = (pagination.pageNumber - 1) * pagination.pageSize
    const limit: number = pagination.pageSize
    return {dbProperties: {skip, limit}, pagination}
}
export default handlerSortingPagination;