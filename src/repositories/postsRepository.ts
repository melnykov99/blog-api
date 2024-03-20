import {Post} from "../libs/types/postsTypes";

const posts: Post[] = []

const postsRepository = {
    getPosts(): Post[] {
        return posts;
    },
    createPost() {
    },
    getPostById() {
    },
    updatePost() {
    },
    deletePost() {
    }
}
export default postsRepository;
export {posts}