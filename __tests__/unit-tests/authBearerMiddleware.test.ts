import { Request, Response, NextFunction } from 'express';
import httpMocks from 'node-mocks-http';
import jwtService from "../../src/libs/common/services/jwtService";
import authBearerMiddleware from "../../src/libs/middlewares/authBearerMiddleware";
import {
    invalidJwtToken,
    jwtTokenWithoutUserId,
    validJwtToken,
    validUserId,
} from "../datasets/unit/authBearerMiddleware";
import {SERVICE_RESPONSES} from "../../src/libs/common/constants/repositoryResponse";

jest.mock("../../src/libs/common/services/jwtService");

describe('authBearerMiddleware', () => {
    let req: httpMocks.MockRequest<Request>;
    let res: httpMocks.MockResponse<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should return 401 if no authorization header is provided', async () => {
        await authBearerMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
        req.headers.authorization = invalidJwtToken;
        (jwtService.getUserIdByJWT as jest.Mock).mockResolvedValue(SERVICE_RESPONSES.UNAUTHORIZED);
        await authBearerMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token does not contain userId', async () => {
        req.headers.authorization = jwtTokenWithoutUserId;
        (jwtService.getUserIdByJWT as jest.Mock).mockResolvedValue(undefined);
        await authBearerMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next and set userId in req.ctx if token is valid', async () => {
        const userId: string = validUserId;
        req.headers.authorization = validJwtToken;
        (jwtService.getUserIdByJWT as jest.Mock).mockResolvedValue(userId);
        await authBearerMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.statusCode).not.toBe(401);
        expect(req.ctx).toBeDefined();
        expect(req.ctx.userId).toBe(validUserId);
    });
});