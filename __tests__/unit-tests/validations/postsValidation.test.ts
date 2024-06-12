import request from "supertest";
import app from "../../../src/setting";
import {authBasic} from "../../datasets/e2e/common";
import {path} from "../../datasets/e2e/paths";
import {createValidPost, deleteAllData} from "../../utils/methods";
import {
    allErrorsMessages, blogIdErrorMessage,
    postEmptyData,
    postInvalidTypeData, postLongData, postNonExistentBlogId,
    postOnlySpaceData,
} from "../../datasets/unit/validations/postsValidation";

beforeEach(async() => {
    await deleteAllData();
});
afterAll(async() => {
    await deleteAllData();
});

describe("posts validation", () => {
    it("should return 400 and errorsMessages if all keys in request invalid format", async() => {
        const response = await _createPost(postInvalidTypeData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request empty", async() => {
        const response = await _createPost(postEmptyData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request is space", async() => {
        const response = await _createPost(postOnlySpaceData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request is long", async() => {
        const response = await _createPost(postLongData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(allErrorsMessages);
    });
    it("should return 400 and blogId error message if website in request not exist", async() => {
        const response = await _createPost(postNonExistentBlogId);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(blogIdErrorMessage);
    });
    it("should not return 400 and errorsMessages if data in request valid", async() => {
        const response = await createValidPost()
        expect(response.statusCode).not.toEqual(400);
        expect(response.body).not.toEqual(allErrorsMessages);
    });

});

const _createPost = async(reqBody: any) => {
    return await request(app)
        .post(path.posts)
        .set(authBasic)
        .send(reqBody);
};