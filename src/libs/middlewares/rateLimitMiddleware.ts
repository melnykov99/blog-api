import {rateLimit, RateLimitRequestHandler} from "express-rate-limit";
import {HTTP_STATUSES} from "../common/constants/httpStatuses";
import {Response, Request} from "express";

// Лимитер запросов. Ограничение 5 запросов за 10 секунд от одного ip-адреса
// Если ограничение превышено, то попадем в handler и выбросим 429 статус. Если всё ок, то неявно express вызывает next()
function createRateLimiter(): RateLimitRequestHandler {
    return rateLimit({
        windowMs: 10 * 1000,
        max: 5,
        handler: (req: Request, res: Response) => {
            res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS);
        }
    });
}

// Для каждого роута отдельный экземпляр лимитера. Лимитер должен работать отдельно на роут.
const registrationLimiter = createRateLimiter();
const registrationConfirmationLimiter = createRateLimiter();
const registrationEmailResendingLimiter = createRateLimiter();
const loginLimiter = createRateLimiter();


export {registrationLimiter, registrationConfirmationLimiter, registrationEmailResendingLimiter, loginLimiter};