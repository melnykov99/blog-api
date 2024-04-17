import { Request } from "express";

// Расширяем тип Request, добавляя в него ctx.userId
declare global {
    namespace Express {
        interface Request {
            ctx: {
                userId?: string | undefined;
            };
        }
    }
}