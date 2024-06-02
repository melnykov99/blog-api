type DeviceDB = {
    ip: string,
    title: string,
    lastActiveDate: string,
    iatRefreshToken: number,
    expRefreshToken: number,
    deviceId: string,
    userId: string,
}
type DeviceOutput = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
}
type DeviceInputInfo = {
    browser: string | undefined,
    ip: string | undefined,
}

export {DeviceDB, DeviceOutput, DeviceInputInfo};