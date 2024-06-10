import {NextFunction, Request, Response} from "express";
import httpMocks from "node-mocks-http";
import checkRefreshTokenMiddleware from "../../../src/libs/middlewares/checkRefreshTokenMiddleware";
import jwtService from "../../../src/libs/common/services/jwtService";
import {
    decodedExpiredRefreshToken, decodedRefreshTokenWithoutDeviceId, decodedRefreshTokenWithoutUserId,
    decodedValidToken,
    expiredRefreshToken,
    invalidRefreshToken, refreshTokenInBlacklist, validDeviceData,
    validRefreshToken,
} from "../../datasets/unit/middlewares/checkRefreshTokenMiddleware";
import tokensBlacklistRepository from "../../../src/repositories/tokensBlackListRepository";
import {REPOSITORY_RESPONSES} from "../../../src/libs/common/constants/repositoryResponse";
import devicesRepository from "../../../src/repositories/devicesRepository";

jest.mock("../../src/libs/common/services/jwtService");
jest.mock("../../src/repositories/tokensBlackListRepository");
jest.mock("../../src/repositories/devicesRepository");

describe("checkRefreshTokenMiddleware", () => {
    let req: httpMocks.MockRequest<Request>;
    let res: httpMocks.MockResponse<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });
    it("should return 401 if no refreshToken cookie is provided", async() => {
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it("should return 401 if refreshToken is not decoded properly", async() => {
        req.cookies = { refreshToken: invalidRefreshToken };
        // Мокаем возврат null при декодировании токена
        (jwtService.getDecodedToken as jest.Mock).mockResolvedValue(null);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it("should return 401 if refreshToken does not contain userId", async() => {
        req.cookies = { refreshToken: invalidRefreshToken };
        // Мокаем возврат токена без userId
        (jwtService.getDecodedToken as jest.Mock).mockResolvedValue(decodedRefreshTokenWithoutUserId);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it("should return 401 if refreshToken does not contain deviceId", async() => {
        req.cookies = { refreshToken: invalidRefreshToken };
        // Мокаем возврат токена без deviceId
        (jwtService.getDecodedToken as jest.Mock).mockResolvedValue(decodedRefreshTokenWithoutDeviceId);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it("should return 401 if refreshToken is expired", async() => {
        req.cookies = { refreshToken: expiredRefreshToken };
        // Мокаем возврат просроченного токена
        (jwtService.getDecodedToken as jest.Mock).mockResolvedValue(decodedExpiredRefreshToken);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it("should return 401 if refreshToken is found in the blacklist", async() => {
        req.cookies = { refreshToken: refreshTokenInBlacklist };
        (jwtService.getDecodedToken as jest.Mock).mockResolvedValue(decodedValidToken);
        (tokensBlacklistRepository.checkTokenInBlacklist as jest.Mock).mockResolvedValue(refreshTokenInBlacklist);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it("should return 500 if an error occurs while checking token in the blacklist", async() => {
        req.cookies = { refreshToken: validRefreshToken };
        (jwtService.getDecodedToken as jest.Mock).mockResolvedValue(decodedValidToken);
        (tokensBlacklistRepository.checkTokenInBlacklist as jest.Mock).mockResolvedValue(REPOSITORY_RESPONSES.UNSUCCESSFULLY);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(500);
    });
    it("should return 401 if no device found for the refreshToken data", async() => {
        req.cookies.refreshToken = validRefreshToken;
        (tokensBlacklistRepository.checkTokenInBlacklist as jest.Mock).mockResolvedValue(REPOSITORY_RESPONSES.NOT_FOUND);
        (devicesRepository.getDeviceByRefreshTokenData as jest.Mock).mockResolvedValue(REPOSITORY_RESPONSES.NOT_FOUND);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it("should return 500 if an error occurs while checking token validity in the database", async() => {
        req.cookies.refreshToken = validRefreshToken;
        (devicesRepository.getDeviceByRefreshTokenData as jest.Mock).mockResolvedValue(REPOSITORY_RESPONSES.UNSUCCESSFULLY);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).toBe(500);
    });

    it("should set userId and deviceId in req.ctx and call next() if device found for the refreshToken data", async() => {
        req.cookies.refreshToken = validRefreshToken;
        (jwtService.getDecodedToken as jest.Mock).mockResolvedValue(decodedValidToken);
        (devicesRepository.getDeviceByRefreshTokenData as jest.Mock).mockResolvedValue(validDeviceData);
        await checkRefreshTokenMiddleware(req, res, next);
        expect(res.statusCode).not.toBe(401);
        expect(req.ctx).toBeDefined();
        expect(req.ctx).toEqual({
            userId: validDeviceData.userId,
            deviceId: validDeviceData.deviceId,
        });
        expect(next).toHaveBeenCalled();
    });

});