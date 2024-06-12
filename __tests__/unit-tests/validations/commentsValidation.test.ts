import request from "supertest";
import app from "../../../src/setting";
import {authBasic} from "../../datasets/e2e/common";
import {path} from "../../datasets/e2e/paths";
import {createValidComment, createValidPost, deleteAllData, generateMockJwtToken} from "../../utils/methods";
import {
    commentEmptyData,
    commentInvalidTypeData, commentLongData, commentOnlySpaceData, commentShortData,
    errorsMessages,
} from "../../datasets/unit/validations/commentsValidation";

beforeEach(async() => {
    await deleteAllData();
});
afterAll(async() => {
    await deleteAllData();
});

describe("blogs validation", () => {
    it("should return 400 and errorsMessages if all keys in request invalid format", async() => {
        const response = await _createComment(commentInvalidTypeData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(errorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request empty", async() => {
        const response = await _createComment(commentEmptyData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(errorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request is space", async() => {
        const response = await _createComment(commentOnlySpaceData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(errorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request is long", async() => {
        const response = await _createComment(commentLongData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(errorsMessages);
    });
    it("should return 400 and errorsMessages if all keys in request is shortly", async() => {
        const response = await _createComment(commentShortData);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(errorsMessages);
    });
    it("should not return 400 and errorsMessages if data in request valid", async() => {
        const response = await createValidComment();
        expect(response.statusCode).not.toEqual(400);
        expect(response.body).not.toEqual(errorsMessages);
    });
});

const _createComment = async(reqBody: any) => {
    const createdPost = await createValidPost();
    const postId = createdPost.body.id;
    const mockJwtToken: string = generateMockJwtToken();
    return await request(app)
        .post(`${path.posts}/${postId}/comments`)
        .set('Authorization', `Bearer ${mockJwtToken}`)
        .send(reqBody);
};