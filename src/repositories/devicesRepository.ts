import {devicesCollection} from "./dbConfig";
import {DeviceDB, DeviceOutput} from "../libs/types/devicesTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {DeleteResult} from "mongodb";

const devicesRepository = {
    async getDevices(userId: string): Promise<DeviceOutput[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            return await devicesCollection.find({userId}, {projection: {_id: false, userId: false, expirationSessionDate: false}}).toArray()
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async deleteOtherDevices(deviceId: string, userId: string): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            // Удаляем все девайсы юзера, кроме переданного в deviceId
            await devicesCollection.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]});
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async addDevice(newDevice: DeviceDB): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY> {
        try {
            await devicesCollection.insertOne({...newDevice})
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async getDevicesUser(deviceId: string): Promise<string | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundDevice: DeviceDB | null = await devicesCollection.findOne({deviceId});
            if (foundDevice === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return foundDevice.userId
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
    async deleteDeviceById(deviceId: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const deletionResult: DeleteResult = await devicesCollection.deleteOne({deviceId});
            if (deletionResult.deletedCount === 0) {
                return REPOSITORY_RESPONSES.NOT_FOUND
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY
        }
    },
}

export default devicesRepository;