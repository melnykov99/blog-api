const validRefreshToken = "Bearer valid_jwt_token";
const invalidRefreshToken = "Bearer invalidToken";
const validUserId = "12345678-aaaa-bbbb-cccc-12345678acbd";
const validDeviceId = "87654321-aaaa-bbbb-cccc-87654321acbd";
const expiredRefreshToken = "Bearer expired_refresh_token";
const refreshTokenInBlacklist = "87654321-aaaa-aaaa-aaaa-87654321acbd";
const decodedExpiredRefreshToken = {
    exp: (Date.now() / 1000) - 3600, // Токен просрочен на час
    iat: (Date.now() / 1000) - 7200, // Токен создан 2 часа назад
    userId: validUserId,
    deviceId: validDeviceId,
};
const decodedRefreshTokenWithoutUserId = {
    exp: Math.floor(Date.now() / 1000) + 3600, // Токен действует еще час
    deviceId: validDeviceId,
};
const decodedRefreshTokenWithoutDeviceId = {
    exp: Math.floor(Date.now() / 1000) + 3600,
    userId: validUserId,
};
const decodedValidToken = {
    exp: (Date.now() / 1000) + 3600,
    iat: (Date.now() / 1000) - 3600,
    userId: validUserId,
    deviceId: validDeviceId,
};
const validDeviceData = {
    ip: "1.1.1.1",
    title: "device 1",
    lastActiveDate: "2024-01-01T05:00:00.000Z",
    iatRefreshToken: (Date.now() / 1000) - 3600,
    expRefreshToken: (Date.now() / 1000) + 3600,
    userId: validUserId,
    deviceId: validDeviceId,
};

export {validRefreshToken, invalidRefreshToken, expiredRefreshToken, validUserId, validDeviceId, decodedValidToken, refreshTokenInBlacklist, validDeviceData, decodedExpiredRefreshToken, decodedRefreshTokenWithoutUserId, decodedRefreshTokenWithoutDeviceId};