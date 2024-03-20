//Массив с видео локальный
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";
import {Video} from "../libs/types/videosTypes";

export const videos: Video[] = []

export const videosRepository = {
    getAllVideos(): Video[] {
        return videos;
    },
    getVideoById(id: number): REPOSITORY_RESPONSE.NOT_FOUND | Video {
        const foundVideo: Video | undefined = videos.find(video => video.id === id);
        if (!foundVideo) {
            return REPOSITORY_RESPONSE.NOT_FOUND;
        }
        return foundVideo;
    },
    createVideo(video: Video): REPOSITORY_RESPONSE.SUCCESSFULLY {
        videos.push(video);
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    },
    updateVideo(updatedVideo: Video) {
        const foundIndex: number = videos.findIndex(video => video.id === updatedVideo.id)
        videos[foundIndex] = updatedVideo
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    },
    deleteVideoById(id: number): REPOSITORY_RESPONSE.SUCCESSFULLY | REPOSITORY_RESPONSE.NOT_FOUND {
        const foundVideoIndex: number = videos.findIndex(video => video.id === id)
        if (foundVideoIndex === -1) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        videos.splice(foundVideoIndex, 1)
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    }
}