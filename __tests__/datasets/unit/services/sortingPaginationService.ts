import {SortingPaginationQuery} from "../../../../src/libs/types/commonTypes";

//common
const emptyQuery = {};

//blogs
const blogValidKeys: string[] = ["id", "name", "description", "websiteUrl", "createdAt", "isMembership"];
const blogInvalidKeys: (string | null | undefined)[] = ["invalidKey", "anotherKey", "123", "", null, undefined];
const blogMixedKeys: (string | null)[] = ["id", "name", "invalidKey", "description", "websiteUrl", "123", "createdAt", null, "isMembership"];
const blogValidQuery: SortingPaginationQuery = {
    pageSize: "20",
    pageNumber: "2",
    sortBy: "name",
    sortDirection: "asc",
    searchNameTerm: "test",
};
const blogInvalidQuery = {
    pageSize: NaN,
    pageNumber: null,
    sortBy: "invalidField",
    sortDirection: 1,
    searchNameTerm: "",
};

//post
const postValidKeys: string[] = ["id", "title", "shortDescription", "content", "blogId", "blogName", "createdAt"];
const postInvalidKeys: (string | null | undefined)[] = ["invalidKey", "anotherKey", "123", "", null, undefined];
const postMixedKeys: (string | null)[] = ["id", "title", "invalidKey", "shortDescription", "content", "123", "blogId", null, "blogName", "createdAt"];

//comment
const commentValidKeys: string[] = ["id", "content", "commentatorInfo", "createdAt"];
const commentInvalidKeys: (string | null | undefined)[] = ["invalidKey", "anotherKey", "123", "", null, undefined];
const commentMixedKeys: (string | null)[] = ["id", "content", "invalidKey", "commentatorInfo", "123", "createdAt", null];
//user
const userValidKeys: string[] = ["id", "login", "email", "createdAt"];
const userInvalidKeys: (string | null | undefined)[] = ["invalidKey", "anotherKey", "123", "", null, undefined];
const userMixedKeys: (string | null)[] = ["id", "login", "invalidKey", "email", "123", "createdAt", null];

export {emptyQuery, blogValidKeys, blogInvalidKeys, blogMixedKeys, blogValidQuery, blogInvalidQuery, postValidKeys, postInvalidKeys, postMixedKeys, commentValidKeys, commentInvalidKeys, commentMixedKeys, userValidKeys, userInvalidKeys, userMixedKeys};