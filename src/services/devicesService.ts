import devicesRepository from "../repositories/devicesRepository";
import {DeviceOutput} from "../libs/types/devicesTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";

const devicesService = {
    async getDevices(userId: string): Promise<DeviceOutput[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        return await devicesRepository.getDevices(userId);
    },
    async deleteOtherDevices() {

    },
    async deleteDeviceById(deviceId: string, userId: string): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.FORBIDDEN | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        const devicesUserId: string | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesRepository.getDevicesUser(deviceId);
        // Если возникла серверная ошибка в репозитории
        if (devicesUserId === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
        // Если device с таким id не был найден
        if (devicesUserId === REPOSITORY_RESPONSES.NOT_FOUND) {
            return REPOSITORY_RESPONSES.NOT_FOUND
        }
        // Если userId у device отличается от того, что пришел в refreshToken (попытка удалить чужой девайс)
        if (devicesUserId !== userId) {
            return REPOSITORY_RESPONSES.FORBIDDEN
        }
        // Удаляем девайс
        return await devicesRepository.deleteDeviceById(deviceId);
    },
}
export default devicesService;