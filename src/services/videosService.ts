import {videosRepository} from "../repositories/videosRepository";
import {AgeRange, AvailableResolutions, Video} from "../libs/types/videosTypes";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";

export const videosService = {
    getAllVideos(): Video[] {
        return videosRepository.getAllVideos()
    },
    getVideoById(id: number): Video | REPOSITORY_RESPONSE.NOT_FOUND {
        return videosRepository.getVideoById(id)
    },
    createVideo(title: string, author: string, availableResolutions: AvailableResolutions[]): REPOSITORY_RESPONSE.SUCCESSFULLY {
        const newVideo: Video = {
            id: Math.floor((Math.random() * 10000000) + 1),
            title: title,
            author: author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
            availableResolutions: availableResolutions ?? ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
        }

        return videosRepository.createVideo(newVideo)
    },
    updateVideo(id: number, title: string, author: string, availableResolutions: AvailableResolutions[] | undefined, canBeDownloaded: boolean | undefined, minAgeRestriction: AgeRange | undefined, publicationDate: string | undefined): REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY {
        const foundVideo: Video | REPOSITORY_RESPONSE.NOT_FOUND = videosRepository.getVideoById(id)
        if (foundVideo === REPOSITORY_RESPONSE.NOT_FOUND) {
            return REPOSITORY_RESPONSE.NOT_FOUND
        }
        const updatedVideo = {
            ...foundVideo,
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded ?? foundVideo.canBeDownloaded,
            minAgeRestriction: minAgeRestriction ?? foundVideo.minAgeRestriction,
            publicationDate: publicationDate ?? foundVideo.publicationDate,
            availableResolutions: availableResolutions ?? foundVideo.availableResolutions,

        }
        videosRepository.updateVideo(updatedVideo)
        return REPOSITORY_RESPONSE.SUCCESSFULLY
    },
    deleteVideoById(id: number): REPOSITORY_RESPONSE.SUCCESSFULLY | REPOSITORY_RESPONSE.NOT_FOUND {
        return videosRepository.deleteVideoById(id)
    }
}