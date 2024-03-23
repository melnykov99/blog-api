import {Blog} from "../libs/types/blogsTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";

const blogs: Blog[] = []

const blogsRepository = {
    getBlogs(): Blog[] {
        return blogs
    },
    createBlog(newBlog: Blog): REPOSITORY_RESPONSES.SUCCESSFULLY {
        blogs.push(newBlog)
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    },
    getBlogById(id: string): Blog | REPOSITORY_RESPONSES.NOT_FOUND {
        const foundBlog: Blog | undefined = blogs.find(blog => blog.id === id)
        if (!foundBlog) {
            return REPOSITORY_RESPONSES.NOT_FOUND
        }
        return foundBlog
    },
    updateBlog(updatedBlog: Blog): REPOSITORY_RESPONSES.SUCCESSFULLY {
        const foundIndex: number = blogs.findIndex(blog => blog.id === updatedBlog.id)
        blogs[foundIndex] = updatedBlog
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    },
    deleteBlog(id: string): REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY {
        const foundIndex: number = blogs.findIndex(blog => blog.id === id)
        if (foundIndex === -1) {
            return REPOSITORY_RESPONSES.NOT_FOUND
        }
        blogs.splice(foundIndex, 1)
        return REPOSITORY_RESPONSES.SUCCESSFULLY
    }
}
export default blogsRepository
export {blogs};