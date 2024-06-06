import sortingPaginationService from "../../src/libs/common/services/sortingPaginationService";
import {SortingPaginationProcessed, SortingPaginationQuery} from "../../src/libs/types/commonTypes";
import {
    blogInvalidKeys, blogInvalidQuery, blogMixedKeys,
    blogValidKeys, blogValidQuery, commentInvalidKeys, commentMixedKeys,
    commentValidKeys, emptyQuery, postInvalidKeys, postMixedKeys,
    postValidKeys, userInvalidKeys, userMixedKeys,
    userValidKeys,
} from "../datasets/unit/sortingPaginationService";

describe("_isValidSortByValueBlog", () => {
    it("should return true for a valid key", () => {
        blogValidKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValueBlog(key)).toBe(true);
        });
    });
    it("should return false for an invalid key", () => {
        blogInvalidKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValueBlog(key as string)).toBe(false);
        });
    });
    it("should return true only for valid keys in mixed array", () => {
        blogMixedKeys.forEach(key => {
            const expectedResult: boolean = blogValidKeys.includes(key as string);
            expect(sortingPaginationService._isValidSortByValueBlog(key as string)).toBe(expectedResult);
        });
    });
});
describe("_isValidSortByValuePost", () => {
    it("should return true for a valid key", () => {
        const validKeys: string[] = ["id", "title", "shortDescription", "content", "blogId", "blogName", "createdAt"];
        validKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValuePost(key)).toBe(true);
        });
    });
    it("should return false for an invalid key", () => {
        postInvalidKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValuePost(key as string)).toBe(false);
        });
    });
    it("should return true only for valid keys in mixed array", () => {
        postMixedKeys.forEach(key => {
            const expectedResult: boolean = postValidKeys.includes(key as string);
            expect(sortingPaginationService._isValidSortByValuePost(key as string)).toBe(expectedResult);
        });
    });
});
describe("_isValidSortByValueComment", () => {
    it("should return true for a valid key", () => {
        commentValidKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValueComment(key)).toBe(true);
        });
    });
    it("should return false for an invalid key", () => {
        commentInvalidKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValueComment(key as string)).toBe(false);
        });
    });
    it("should return true only for valid keys in mixed array", () => {
        commentMixedKeys.forEach(key => {
            const expectedResult: boolean = commentValidKeys.includes(key as string);
            expect(sortingPaginationService._isValidSortByValueComment(key as string)).toBe(expectedResult);
        });
    });
});
describe("_isValidSortByValueUser", () => {
    it("should return true for a valid key", () => {
        userValidKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValueUser(key)).toBe(true);
        });
    });
    it("should return false for an invalid key", () => {
        userInvalidKeys.forEach(key => {
            expect(sortingPaginationService._isValidSortByValueUser(key as string)).toBe(false);
        });
    });
    it("should return true only for valid keys in mixed array", () => {
        userMixedKeys.forEach(key => {
            const expectedResult: boolean = userValidKeys.includes(key as string);
            expect(sortingPaginationService._isValidSortByValueUser(key as string)).toBe(expectedResult);
        });
    });
});
describe("processingSortPag", () => {
    it("should return default pagination and sorting parameters for blogs if query is empty", () => {
        const result: SortingPaginationProcessed = sortingPaginationService.processingSortPag(emptyQuery as SortingPaginationQuery, "blogs");
        expect(result.pagination.pageSize).toBe(10);
        expect(result.pagination.pageNumber).toBe(1);
        expect(result.sorting.sortBy).toBe("createdAt");
        expect(result.sorting.sortDirection).toBe(-1);
        expect(result.searchParams.searchNameTerm).toBeUndefined();
        expect(result.dbProperties.skip).toBe(0);
        expect(result.dbProperties.limit).toBe(10);
    });
    it("should return custom pagination and sorting parameters for blogs with valid query", () => {
        const result: SortingPaginationProcessed = sortingPaginationService.processingSortPag(blogValidQuery, "blogs");
        expect(result.pagination.pageSize).toBe(20);
        expect(result.pagination.pageNumber).toBe(2);
        expect(result.sorting.sortBy).toBe("name");
        expect(result.sorting.sortDirection).toBe(1);
        expect(result.searchParams.searchNameTerm).toBe("test");
        expect(result.dbProperties.skip).toBe(20);
        expect(result.dbProperties.limit).toBe(20);
    });
    it("should return default pagination and sorting parameters for blogs if query has invalid sortBy value", () => {
        const result: SortingPaginationProcessed = sortingPaginationService.processingSortPag(blogInvalidQuery as unknown as SortingPaginationQuery, "blogs");
        expect(result.pagination.pageSize).toBe(10);
        expect(result.pagination.pageNumber).toBe(1);
        expect(result.sorting.sortBy).toBe("createdAt");
        expect(result.sorting.sortDirection).toBe(-1);
        expect(result.searchParams.searchNameTerm).toBeUndefined();
        expect(result.dbProperties.skip).toBe(0);
        expect(result.dbProperties.limit).toBe(10);
    });
    // Метод сортировки один для всех сервисов, поэтому делать такие же тесты для posts/comments/users нет смысла
    // А методы на определение sortBy для каждого сервиса протестировали выше
});