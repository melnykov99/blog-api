import {devicesCollection} from "./dbConfig";
import {DeviceDB} from "../libs/types/devicesTypes";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {DeleteResult} from "mongodb";

const devicesRepository = {
    async getDevices(userId: string): Promise<DeviceDB[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            return await devicesCollection.find({userId}).toArray();
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async deleteOtherDevices(deviceId: string, userId: string): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            // Удаляем все девайсы юзера, кроме переданного в deviceId
            await devicesCollection.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]});
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async addDevice(newDevice: DeviceDB): Promise<REPOSITORY_RESPONSES.UNSUCCESSFULLY | REPOSITORY_RESPONSES.SUCCESSFULLY> {
        try {
            await devicesCollection.insertOne({...newDevice});
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async getDevicesUser(deviceId: string): Promise<string | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundDevice: DeviceDB | null = await devicesCollection.findOne({deviceId});
            if (foundDevice === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND;
            }
            return foundDevice.userId;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    async deleteDeviceById(deviceId: string): Promise<REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const deletionResult: DeleteResult = await devicesCollection.deleteOne({deviceId});
            if (deletionResult.deletedCount === 0) {
                return REPOSITORY_RESPONSES.NOT_FOUND;
            }
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    // Если токен токен с таким userId и временем создания не найден значит он уже невалидный (был заменен более актуальный токеном или девайс удален).
    async getDeviceByRefreshTokenData(userId: string, iatRefreshToken: number): Promise<DeviceDB | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            const foundDevice: DeviceDB | null = await devicesCollection.findOne({
                userId: userId,
                iatRefreshToken: iatRefreshToken,
            });
            if (foundDevice === null) {
                return REPOSITORY_RESPONSES.NOT_FOUND;
            }
            return foundDevice;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
    // Обновление даты последний активности и дат refreshToken у девайса. Выполняется при обновлении токенов
    async updateDeviceTokenDates(deviceId: string, lastActiveDate: string, iatRefreshToken: number, expRefreshToken: number): Promise<REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY> {
        try {
            await devicesCollection.updateOne({deviceId: deviceId}, {
                $set: {
                    lastActiveDate: lastActiveDate,
                    iatRefreshToken: iatRefreshToken,
                    expRefreshToken: expRefreshToken,
                },
            });
            return REPOSITORY_RESPONSES.SUCCESSFULLY;
        } catch (error) {
            return REPOSITORY_RESPONSES.UNSUCCESSFULLY;
        }
    },
};

export default devicesRepository;