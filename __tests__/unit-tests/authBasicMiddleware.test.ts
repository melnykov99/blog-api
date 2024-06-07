import { Request, Response, NextFunction } from 'express';
import httpMocks from 'node-mocks-http';
import authBasicMiddleware from "../../src/libs/middlewares/authBasicMiddleware";
import {invalidHeaderToken, validHeaderToken} from "../datasets/unit/authBasicMiddleware";

describe('authBasicMiddleware', () => {
    //Настройка объектов req, res, response
    let req: httpMocks.MockRequest<Request>;
    let res: httpMocks.MockResponse<Response>;
    let next: NextFunction;

    //Перед каждым тестом создаем моки объектов req, res, next
    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should return 401 if no authorization header is provided', () => {
        authBasicMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 401 if the authorization token is incorrect', () => {
        req.headers.authorization = invalidHeaderToken;
        authBasicMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });
    it('should call next if the authorization token is correct', () => {
        req.headers.authorization = validHeaderToken;
        authBasicMiddleware(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(next).toHaveBeenCalled();
    });
});