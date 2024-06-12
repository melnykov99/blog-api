import request from "supertest";
import app from "../../src/setting";
import {path} from "../datasets/e2e/paths";
import {authBasic} from "../datasets/e2e/common";
import {blogValidData} from "../datasets/unit/validations/blogsValidation";
import {commentValidData} from "../datasets/unit/validations/commentsValidation";

const deleteAllData = async() => {
    await request(app)
        .delete(path.deleteData)
        .expect(204);
};
const createValidBlog = async() => {
    return await request(app)
        .post(path.blogs)
        .set(authBasic)
        .send(blogValidData)
        .expect(201);
};
const createValidPost = async() => {
    const createdBlog = await createValidBlog();
    const blogId = createdBlog.body.blogId;
    return await request(app)
        .post(path.posts)
        .set(authBasic)
        .send({
            title: "title",
            shortDescription: "shortDescription",
            content: "content",
            blogId: blogId,
        })
        .expect(201);
};
const createValidComment = async() => {
    const createdPost = await createValidPost();
    const postId = createdPost.body.id;
    return await request(app)
        .post(`${path.posts}/${postId}/comments`)
        .set(authBasic)
        .send(commentValidData)
        .expect(201);
};
export {deleteAllData, createValidBlog, createValidPost, createValidComment};