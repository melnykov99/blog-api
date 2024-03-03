import {videosRepository} from "../repositories/videosRepository";

export const videosService = {
    getAllVideos() {
        return videosRepository.getAllVideos()
    },
    getVideoById(id: number) {
        return videosRepository.getVideoById(id)
    },
    deleteVideoById(id: number) {
        return videosRepository.deleteVideoById(id)
    }
}