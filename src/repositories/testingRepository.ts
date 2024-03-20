import {videos} from "./videosRepository";
import {blogs} from "./blogsRepository"
import {posts} from "./postsRepository";

export const testingRepository = {
    deleteAllVideos() {
        videos.splice(0, videos.length)
        blogs.splice(0, blogs.length)
        posts.splice(0, posts.length)
    }
}