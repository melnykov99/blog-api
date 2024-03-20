import postsRepository from "../repositories/postsRepository";
import {Post} from "../libs/types/postsTypes";

const postsService = {
    getPosts(): Post[] {
        return postsRepository.getPosts()
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
export default postsService;