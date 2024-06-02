import {
    Pagination, SearchEmailTerm, SearchLoginTerm,
    SearchNameTerm, ServiceForSortingPagination,
    Sorting,
    SortingPaginationProcessed,
    SortingPaginationQuery
} from "../../types/commonTypes";
import {BlogOutput} from "../../types/blogsTypes";
import {PostOutput} from "../../types/postsTypes";
import {CommentOutput} from "../../types/commentsTypes";
import {UserOutput} from "../../types/usersTypes";

const sortingPaginationService = {
    processingSortPag(query: SortingPaginationQuery, service: ServiceForSortingPagination): SortingPaginationProcessed {
        const pagination: Pagination = {
            pageSize: query.pageSize === undefined ? 10 : Number(query.pageSize),
            pageNumber: query.pageNumber === undefined ? 1 : Number(query.pageNumber)
        };
        // Объявлением переменную sortBy в которую дальше определим значение в зависимости от того, где функция сортировки была вызвана и что пришло в query
        let sortBy;
        // определяем из какого сервиса вызвана функция сортировки и в зависимости от этого определяем sortBy
        switch (service) {
            // Если в sortBy ничего, то по умолчанию сортировка по полю createdAt
            // Если значение в sortBy невалидно и не соответствует сущности, то сортировка по createdAt
            // Если прислали валидное значение, то сортировка по нему
            case "blogs":
                sortBy = query.sortBy === undefined ? "createdAt" : (!this._isValidSortByValueBlog(query.sortBy)) ? "createdAt" : query.sortBy;
                break;
            case "posts":
                sortBy = query.sortBy === undefined ? "createdAt" : (!this._isValidSortByValuePost(query.sortBy)) ? "createdAt" : query.sortBy;
                break;
            case "comments":
                sortBy = query.sortBy === undefined ? "createdAt" : (!this._isValidSortByValueComment(query.sortBy)) ? "createdAt" : query.sortBy;
                break;
            case "users":
                sortBy = query.sortBy === undefined ? "createdAt" : (!this._isValidSortByValueUser(query.sortBy)) ? "createdAt" : query.sortBy;
                break;
        }
        const sorting: Sorting = {
            // Если в sortDirection ничего, то по умолчанию сортировка -1
            // Если в sortDirection "asc", то делаем сортировку 1, во всех иных случаях -1 как по умолчанию
            sortDirection: query.sortDirection === undefined ? -1 : query.sortDirection === "asc" ? 1 : -1,
            // Присваиваем sortBy, определенный выше
            sortBy: sortBy
        };
        const searchNameTerm: SearchNameTerm = query.searchNameTerm === undefined ? undefined : query.searchNameTerm;
        const searchLoginTerm: SearchLoginTerm = query.searchLoginTerm === undefined ? undefined : query.searchLoginTerm;
        const searchEmailTerm: SearchEmailTerm = query.searchEmailTerm === undefined ? undefined : query.searchEmailTerm;
        // skip по формуле считаем
        const skip: number = (pagination.pageNumber - 1) * pagination.pageSize;
        // limit это pageSize
        const limit: number = pagination.pageSize;
        return {dbProperties: {skip, limit}, pagination, sorting, searchParams: {searchNameTerm, searchLoginTerm, searchEmailTerm}};
    },
    // Функция содержит возможные ключи блогов и постов. Для проверки значения sortBy
    _isValidSortByValueBlog(value: string): value is keyof BlogOutput{
        return Object.keys({
            id: true,
            name: true,
            description: true,
            websiteUrl: true,
            createdAt: true,
            isMembership: true,
        }).includes(value);
    },
    _isValidSortByValuePost(value: string): value is keyof PostOutput{
        return Object.keys({
            id: true,
            title: true,
            shortDescription: true,
            content: true,
            blogId: true,
            blogName: true,
            createdAt: true,
        }).includes(value);
    },
    _isValidSortByValueComment(value: string): value is keyof CommentOutput{
        return Object.keys({
            id: true,
            content: true,
            commentatorInfo: true,
            createdAt: true,
        }).includes(value);
    },
    _isValidSortByValueUser(value: string): value is keyof UserOutput{
        return Object.keys({
            id: true,
            login: true,
            email: true,
            createdAt: true,
        }).includes(value);
    },
};
export default sortingPaginationService;