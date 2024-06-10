import request from "supertest";
import app from "../../../src/setting";
import { path } from "../../datasets/e2e/paths";

describe("rate limiter", () => {
    it("login route should return 429 status if the 6th request in 10 seconds is executed", async() => {
        // Отправляем 5 запросов, чтобы превысить лимит
        for (let i = 0; i < 5; i++) {
            const response = await request(app).post(`${path.auth}/login`);
            expect(response.statusCode).toBe(400);
        }
        // Последний запрос должен вернуть статус 429
        const response = await request(app).post(`${path.auth}/login`);
        expect(response.statusCode).toBe(429);
    });
    it("registration route should return 429 status if the 6th request in 10 seconds is executed", async() => {
        for (let i = 0; i < 5; i++) {
            const response = await request(app).post(`${path.auth}/registration`);
            expect(response.statusCode).toBe(400);
        }
        const response = await request(app).post(`${path.auth}/registration`);
        expect(response.statusCode).toBe(429);
    });
    it("registration email resending route should return 429 status if the 6th request in 10 seconds is executed", async() => {
        for (let i = 0; i < 5; i++) {
            const response = await request(app).post(`${path.auth}/registration-email-resending`);
            expect(response.statusCode).toBe(400);
        }
        const response = await request(app).post(`${path.auth}/registration-email-resending`);
        expect(response.statusCode).toBe(429);
    });
    it("registration confirmation route should return 429 status if the 6th request in 10 seconds is executed", async() => {
        for (let i = 0; i < 5; i++) {
            const response = await request(app).post(`${path.auth}/registration-confirmation`);
            expect(response.statusCode).toBe(400);
        }
        const response = await request(app).post(`${path.auth}/registration-confirmation`);
        expect(response.statusCode).toBe(429);
    });
});