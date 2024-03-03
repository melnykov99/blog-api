import {testingRepository} from "../repositories/testingRepository";

export const testingService = {
    deleteAllVideos() {
        return testingRepository.deleteAllVideos()
    }
}