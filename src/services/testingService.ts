import {testingRepository} from "../repositories/testingRepository";

export const testingService = {
    deleteAllData() {
        return testingRepository.deleteAllData()
    }
}