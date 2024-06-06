import filterService from "../../src/libs/common/services/filterService";
import {BlogsDbFilter} from "../../src/libs/types/blogsTypes";
import {UsersDbFilter} from "../../src/libs/types/usersTypes";

describe("filterForBlogs", () => {
    it("should return an empty filter when searchNameTerm is not provided", () => {
        const searchNameTerm = undefined;
        const expectedFilter = {};
        const result: BlogsDbFilter = filterService.filterForBlogs(searchNameTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return an empty filter when searchNameTerm is an empty string", () => {
        const searchNameTerm = "";
        const expectedFilter = {};
        const result: BlogsDbFilter = filterService.filterForBlogs(searchNameTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return a regex filter when searchNameTerm is provided", () => {
        const searchNameTerm = "test";
        const expectedFilter = { name: { $regex: "test", $options: "i" } };
        const result: BlogsDbFilter = filterService.filterForBlogs(searchNameTerm);
        expect(result).toEqual(expectedFilter);
    });
});
describe("filterForUsers", () => {
    it("should return a filter with both login and email regex when both searchLoginTerm and searchEmailTerm are provided", () => {
        const searchLoginTerm = "testLogin";
        const searchEmailTerm = "testEmail";
        const expectedFilter = { login: { $regex: "testLogin", $options: "i" }, email: { $regex: "testEmail", $options: "i" } };
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return a filter with login regex when searchLoginTerm is provided and searchEmailTerm is not", () => {
        const searchLoginTerm = "testLogin";
        const searchEmailTerm = undefined;
        const expectedFilter = { login: { $regex: "testLogin", $options: "i" } };
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return a filter with email regex when searchEmailTerm is provided and searchLoginTerm is not", () => {
        const searchLoginTerm = undefined;
        const searchEmailTerm = "testEmail";
        const expectedFilter = { email: { $regex: "testEmail", $options: "i" } };
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return an empty filter when searchLoginTerm and searchEmailTerm are not provided", () => {
        const searchLoginTerm = undefined;
        const searchEmailTerm = undefined;
        const expectedFilter = {};
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });

    it("should return an empty filter when searchLoginTerm is an empty string and searchEmailTerm is not provided", () => {
        const searchLoginTerm = "";
        const searchEmailTerm = undefined;
        const expectedFilter = {};
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return an empty filter when searchEmailTerm is an empty string and searchLoginTerm is not provided", () => {
        const searchLoginTerm = undefined;
        const searchEmailTerm = "";
        const expectedFilter = {};
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return a filter with login regex when searchLoginTerm is provided and searchEmailTerm is an empty string", () => {
        const searchLoginTerm = "testLogin";
        const searchEmailTerm = "";
        const expectedFilter = { login: { $regex: "testLogin", $options: "i" } };
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });
    it("should return a filter with email regex when searchEmailTerm is provided and searchLoginTerm is an empty string", () => {
        const searchLoginTerm = "";
        const searchEmailTerm = "testEmail";
        const expectedFilter = { email: { $regex: "testEmail", $options: "i" } };
        const result: UsersDbFilter = filterService.filterForUsers(searchLoginTerm, searchEmailTerm);
        expect(result).toEqual(expectedFilter);
    });
});