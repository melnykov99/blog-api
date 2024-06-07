import request from "supertest";
import app from "../../src/setting";
import {path} from "../datasets/e2e/paths";
import {blogsEmptyResponse, validBlogBody} from "../datasets/e2e/blogs";
import {authBasic} from "../datasets/e2e/common";
const _deleteAllData = async() => {
    await request(app)
        .delete(path.deleteData)
        .expect(204);
}
const _createBlog = async() => {
    return await request(app)
        .post(path.blogs)
        .set(authBasic)
        .send(validBlogBody)
        .expect(201);
}
beforeEach(async() => {
    await _deleteAllData();
})
afterAll(async() => {
    await _deleteAllData();
})
describe("/blogs routes", () => {
    describe("GET /blogs", () => {
        it("should return 200 and default sorting, pagination and empty items array", async() => {
            const getResponse = await request(app)
                .get(path.blogs)
                .expect(200)
            expect(getResponse.body).toEqual(blogsEmptyResponse)
        });
        it("should create blog, next return 200 and items array should not be empty", async() => {
            await _createBlog()
            const getResponse = await request(app)
                .get(path.blogs)
                .expect(200)
            expect(getResponse.body).not.toEqual(blogsEmptyResponse)
        });
    })
    describe("POST /blogs", () => {

    })

});