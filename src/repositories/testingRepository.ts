import {blogs} from "./blogsRepository"
import {posts} from "./postsRepository";

export const testingRepository = {
    deleteAllData() {
        blogs.splice(0, blogs.length)
        posts.splice(0, posts.length)
    }
}