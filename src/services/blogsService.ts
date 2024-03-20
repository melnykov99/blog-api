import blogsRepository from "../repositories/blogsRepository";
import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";

const blogsService = {
    getBlogs(): Blog[] {
        return blogsRepository.getBlogs()
    },
    createBlog(name: string, description: string, websiteUrl: string): Blog {
        const newBlog: Blog = {
            id: Math.floor((Math.random() * 10000000) + 1).toString(),
            name,
            description,
            websiteUrl
        }
        blogsRepository.createBlog(newBlog)
        return newBlog
    },
    getBlogById(id: string): Blog | REPOSITORY_RESPONSE.NOT_FOUND {
        return blogsRepository.getBlogById(id)
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string): REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY {
        const foundBlog: Blog | REPOSITORY_RESPONSE.NOT_FOUND = blogsRepository.getBlogById(id)
        if (foundBlog === REPOSITORY_RESPONSE.NOT_FOUND) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        const updatedBlog: Blog = {
            ...foundBlog,
            name,
            description,
            websiteUrl
        }
        return blogsRepository.updateBlog(updatedBlog)
    },
    deleteBlog(id: string): REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY {
        return blogsRepository.deleteBlog(id)
    }
}
export default blogsService;