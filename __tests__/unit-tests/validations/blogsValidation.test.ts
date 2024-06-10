import request from "supertest";
import app from "../../../src/setting";
import {authBasic} from "../../datasets/e2e/common";
import {path} from "../../datasets/e2e/paths";
import {
    allErrorsMessages,
    blogEmptyData,
    blogInvalidTypeData, blogInvalidWebsiteData,
    blogLongData,
    blogOnlySpaceData, blogValidData, webSiteErrorMessage,
} from "../../datasets/unit/validations/blogsValidation";

describe("blogs validation", () => {
    it("should return 400 and errorsMessages if all keys in request invalid format", async() => {
        const response = await _createBlog(blogInvalidTypeData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request empty ", async() => {
        const response = await _createBlog(blogEmptyData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request is space ", async() => {
        const response = await _createBlog(blogOnlySpaceData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request is long ", async() => {
        const response = await _createBlog(blogLongData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and websiteUrl error message if website in request have incorrect format", async() => {
        const response = await _createBlog(blogInvalidWebsiteData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(webSiteErrorMessage);
    });
    it("should not return 400 and errorsMessages if data in request valid", async() => {
        const response = await _createBlog(blogValidData);
        expect(response.statusCode).not.toEqual(400);
        expect(response.body).not.toEqual(allErrorsMessages);
    });
});
const _createBlog = async(reqBody: any) => {
    return await request(app)
        .post(path.blogs)
        .set(authBasic)
        .send(reqBody);
};