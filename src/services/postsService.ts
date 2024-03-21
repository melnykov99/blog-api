import postsRepository from "../repositories/postsRepository";
import {Post} from "../libs/types/postsTypes";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";

const postsService = {
    getPosts(): Post[] {
        return postsRepository.getPosts()
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string): Post {
        const newPost: Post = {
            id: Math.floor((Math.random() * 10000000) + 1).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName
        }
        postsRepository.createPost(newPost)
        return newPost
    },
    getPostById(id: string): Post | REPOSITORY_RESPONSE.NOT_FOUND {
        return postsRepository.getPostById(id)
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string): REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY {
        const foundPost: Post | REPOSITORY_RESPONSE.NOT_FOUND = postsRepository.getPostById(id)
        if (foundPost === REPOSITORY_RESPONSE.NOT_FOUND) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        const updatedPost: Post = {
            ...foundPost,
            title,
            shortDescription,
            content,
            blogId,
            blogName
        }
        return postsRepository.updatePost(updatedPost)
    },
    deletePost(id: string): REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY {
        return postsRepository.deletePost(id)
    }
}
export default postsService;