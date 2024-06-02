/* eslint-disable */
import { Request } from "express";

// Расширяем тип Request, добавляя в него userId и deviceId.
declare global {
    namespace Express {
        interface Request {
            ctx: {
                userId?: string | undefined;
                deviceId?: string | undefined;
            };
        }
    }
}