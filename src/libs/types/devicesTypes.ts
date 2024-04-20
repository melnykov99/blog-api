type DeviceDB = {
    id: string,
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
    userId: string,
}
type DeviceOutput = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
}

export {DeviceDB, DeviceOutput}