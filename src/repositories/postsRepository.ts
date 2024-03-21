import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";

const posts: Post[] = []

const postsRepository = {
    getPosts(): Post[] {
        return posts;
    },
    createPost(newPost: Post): REPOSITORY_RESPONSE.SUCCESSFULLY {
        posts.push(newPost)
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    },
    getPostById(id: string): Post | REPOSITORY_RESPONSE.NOT_FOUND {
        const foundPost: Post | undefined = posts.find(post => post.id === id)
        if (foundPost === undefined) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        return foundPost
    },
    updatePost(updatedPost: Post): REPOSITORY_RESPONSE.SUCCESSFULLY {
        const foundIndex: number = posts.findIndex(post => post.id === updatedPost.id)
        posts[foundIndex] = updatedPost
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    },
    deletePost(id: string): REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY {
        const foundIndex: number = posts.findIndex(post => post.id === id)
        if (foundIndex === -1) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        posts.splice(foundIndex, 1)
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    }
}
export default postsRepository;
export {posts}