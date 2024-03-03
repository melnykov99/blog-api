//Массив с видео локальный
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";

export let videos = [
    {
        id: 1,
        title: "test title",
        author: "test author",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2024-03-02T12:12:26.781Z",
        publicationDate: "2024-03-02T12:12:26.781Z",
        availableResolutions: [
            "P144", "P360", "P480", "P720"
        ]
    },
]

export const videosRepository = {
    getAllVideos() {
        return videos;
    },
    getVideoById(id: number) {
        const foundVideo = videos.find(video => video.id === id);
        if (foundVideo === undefined) {
            return REPOSITORY_RESPONSE.NOT_FOUND;
        }
        return foundVideo;
    },
    deleteVideoById(id: number) {
        const foundVideoIndex = videos.findIndex(video => video.id === id)
        if (foundVideoIndex === -1) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        videos.splice(foundVideoIndex, 1)
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    }
}