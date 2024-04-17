import {
    Pagination, SearchEmailTerm, SearchLoginTerm,
    SearchNameTerm,
    Sorting,
    SortingPaginationProcessed,
    SortingPaginationQuery
} from "../../types/commonTypes";
import {Blog} from "../../types/blogsTypes";
import {Post} from "../../types/postsTypes";

const sortingPaginationService = {
    processingSortPag(query: SortingPaginationQuery): SortingPaginationProcessed {
        const pagination: Pagination = {
            pageSize: query.pageSize === undefined ? 10 : Number(query.pageSize),
            pageNumber: query.pageNumber === undefined ? 1 : Number(query.pageNumber)
        }
        const sorting: Sorting = {
            // Если в sortDirection ничего, то по умолчанию сортировка -1
            // Если в sortDirection 'asc', то делаем сортировку 1, во всех иных случаях -1 как по умолчанию
            sortDirection: query.sortDirection === undefined ? -1 : query.sortDirection === 'asc' ? 1 : -1,
            // Если в sortBy ничего, то по умолчанию сортировка по полю createdAt
            // Если значение в sortBy невалидно и не соответствует полям блогов или постов, то сортировка по createdAt
            sortBy: query.sortBy === undefined ? 'createdAt' : (!this.isValidSortByValue(query.sortBy)) ? 'createdAt' : query.sortBy
        }
        const searchNameTerm: SearchNameTerm = query.searchNameTerm === undefined ? null : query.searchNameTerm;
        const searchLoginTerm: SearchLoginTerm = query.searchLoginTerm === undefined ? null : query.searchLoginTerm;
        const searchEmailTerm: SearchEmailTerm = query.searchEmailTerm === undefined ? null : query.searchEmailTerm;
        // skip по формуле считаем
        const skip: number = (pagination.pageNumber - 1) * pagination.pageSize;
        // limit это pageSize
        const limit: number = pagination.pageSize;
        return {dbProperties: {skip, limit}, pagination, sorting, searchParams: {searchNameTerm, searchLoginTerm, searchEmailTerm}}
    },
    // Функция содержит возможные ключи блогов и постов. Для проверки значения sortBy
    isValidSortByValue(value: any): value is keyof Blog | Post{
        //TODO: неидеально работает. При запросе блогов можно указать title и будет сортировка по title, которого в блогах нет
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
}
export default sortingPaginationService;