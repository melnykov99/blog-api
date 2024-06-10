import request from "supertest";
import app from "../../src/setting";
import {path} from "../datasets/e2e/paths";
import {authBasic} from "../datasets/e2e/common";
import {validBlogBody} from "../datasets/e2e/blogs";

const deleteAllData = async() => {
    await request(app)
        .delete(path.deleteData)
        .expect(204);
};
const createBlog = async() => {
    return await request(app)
        .post(path.blogs)
        .set(authBasic)
        .send(validBlogBody)
        .expect(201);
};
export {deleteAllData, createBlog}