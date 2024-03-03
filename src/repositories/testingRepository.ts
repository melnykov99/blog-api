import {videos} from "./videosRepository";

export const testingRepository = {
    deleteAllVideos() {
        videos.splice(0, videos.length)
    }
}