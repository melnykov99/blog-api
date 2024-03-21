import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";

const blogs: Blog[] = []

const blogsRepository = {
    getBlogs(): Blog[] {
        return blogs
    },
    createBlog(newBlog: Blog): REPOSITORY_RESPONSE.SUCCESSFULLY {
        blogs.push(newBlog)
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    },
    getBlogById(id: string): Blog | REPOSITORY_RESPONSE.NOT_FOUND {
        const foundBlog: Blog | undefined = blogs.find(blog => blog.id === id)
        if (!foundBlog) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        return foundBlog
    },
    updateBlog(updatedBlog: Blog): REPOSITORY_RESPONSE.SUCCESSFULLY {
        const foundIndex: number = blogs.findIndex(blog => blog.id === updatedBlog.id)
        blogs[foundIndex] = updatedBlog
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    },
    deleteBlog(id: string): REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY {
        const foundIndex: number = blogs.findIndex(blog => blog.id === id)
        if (foundIndex === -1) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        blogs.splice(foundIndex, 1)
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    }
}
export default blogsRepository
export {blogs};