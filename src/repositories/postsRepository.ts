import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";

const posts: Post[] = []

const postsRepository = {
    getPosts(): Post[] {
        return posts;
    },
    createPost(newPost: Post): REPOSITORY_RESPONSES.SUCCESSFULLY {
        posts.push(newPost)
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    },
    getPostById(id: string): Post | REPOSITORY_RESPONSES.NOT_FOUND {
        const foundPost: Post | undefined = posts.find(post => post.id === id)
        if (foundPost === undefined) {
            return REPOSITORY_RESPONSES.NOT_FOUND
        }
        return foundPost
    },
    updatePost(updatedPost: Post): REPOSITORY_RESPONSES.SUCCESSFULLY {
        const foundIndex: number = posts.findIndex(post => post.id === updatedPost.id)
        posts[foundIndex] = updatedPost
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    },
    deletePost(id: string): REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY {
        const foundIndex: number = posts.findIndex(post => post.id === id)
        if (foundIndex === -1) {
            return REPOSITORY_RESPONSES.NOT_FOUND
        }
        posts.splice(foundIndex, 1)
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    }
}
export default postsRepository;
export {posts}