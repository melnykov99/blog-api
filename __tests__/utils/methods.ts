import request from "supertest";
import app from "../../src/setting";
import {path} from "../datasets/e2e/paths";
import {authBasic} from "../datasets/e2e/common";
import {blogValidData} from "../datasets/unit/validations/blogsValidation";
import {commentValidData} from "../datasets/unit/validations/commentsValidation";
import jwt from "jsonwebtoken";

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
    const blogId = createdBlog.body.id;
    return await request(app)
        .post(path.posts)
        .set(authBasic)
        .send({
            title: "title",
            shortDescription: "shortDescription",
            content: "content",
            blogId,
        })
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
const generateMockJwtToken = () => {
    const payload = { userId: '11112222-aaaa-bbbb-cccc-12345678901234' };
    const secret = 'secret-key';
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};
export {deleteAllData, createValidBlog, createValidPost, createValidComment, generateMockJwtToken};