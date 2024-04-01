import {
    Pagination, SearchEmailTerm, SearchLoginTerm,
    SearchNameTerm,
    Sorting,
    SortingPaginationProcessed,
    SortingPaginationQuery
} from "../../types/commonTypes";
import {Blog} from "../../types/blogsTypes";
import {Post} from "../../types/postsTypes";

function isValidSortByValue(value: any): value is keyof Blog | Post{
    return Object.keys({
        //blog keys
        id: true,
        name: true,
        description: true,
        websiteUrl: true,
        createdAt: true,
        isMembership: true,
        //post keys
        title: true,
        shortDescription: true,
        content: true,
        blogId: true,
        blogName: true,
    }).includes(value);
}

function handlerSortingPagination(query: SortingPaginationQuery): SortingPaginationProcessed {
    const pagination: Pagination = {
        pageSize: query.pageSize === undefined ? 10 : Number(query.pageSize),
        pageNumber: query.pageNumber === undefined ? 1 : Number(query.pageNumber)
    }
    const sorting: Sorting = {
        sortDirection: query.sortDirection === undefined ? -1 : query.sortDirection === 'desc' ? -1 : 1,
        sortBy: query.sortBy === undefined ? 'createdAt' : (!isValidSortByValue(query.sortBy)) ? 'createdAt' : query.sortBy
    }
    const searchNameTerm: SearchNameTerm = query.searchNameTerm === undefined ? null : query.searchNameTerm;
    const searchLoginTerm: SearchLoginTerm = query.searchLoginTerm === undefined ? null : query.searchLoginTerm;
    const searchEmailTerm: SearchEmailTerm = query.searchEmailTerm === undefined ? null : query.searchEmailTerm;
    const skip: number = (pagination.pageNumber - 1) * pagination.pageSize
    const limit: number = pagination.pageSize
    return {dbProperties: {skip, limit}, pagination, sorting, searchParams: {searchNameTerm, searchLoginTerm, searchEmailTerm}}
}
export default handlerSortingPagination;