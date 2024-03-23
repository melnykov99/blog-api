import blogsRepository from "../repositories/blogsRepository";
import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";

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
    getBlogById(id: string): Blog | REPOSITORY_RESPONSES.NOT_FOUND {
        return blogsRepository.getBlogById(id)
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string): REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY {
        const foundBlog: Blog | REPOSITORY_RESPONSES.NOT_FOUND = blogsRepository.getBlogById(id)
        if (foundBlog === REPOSITORY_RESPONSES.NOT_FOUND) {
            return REPOSITORY_RESPONSES.NOT_FOUND
        }
        const updatedBlog: Blog = {
            ...foundBlog,
            name,
            description,
            websiteUrl
        }
        return blogsRepository.updateBlog(updatedBlog)
    },
    deleteBlog(id: string): REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY {
        return blogsRepository.deleteBlog(id)
    }
}
export default blogsService;