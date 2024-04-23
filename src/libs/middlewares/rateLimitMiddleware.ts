import {rateLimit, RateLimitRequestHandler} from 'express-rate-limit'
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import {NextFunction, Response, Request} from "express";

// Лимитер запросов. Ограничение 5 запросов за 10 секунд от одного ip-адреса
// Если ограничение превышено, то попадем в handler и выбросим 429 статус. Если всё ок, то неявно express вызывает next()
const limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 10 * 1000, // Запоминаем кол-во запросов на 10 секунд
    limit: 3, // Лимит 5 запросов
    handler: (req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS)
        return
    },
})

export default limiter;