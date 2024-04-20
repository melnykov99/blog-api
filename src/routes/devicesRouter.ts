import express, {Request, Response, Router} from "express";
import checkRefreshTokenMiddleware from "../libs/middlewares/checkRefreshTokenMiddleware";
import devicesService from "../services/devicesService";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";
import {DeviceOutput} from "../libs/types/devicesTypes";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import {RequestWithParams} from "../libs/types/requestsResponsesTypes";

const devicesRouter: Router = express.Router();

devicesRouter.get('/', checkRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const foundDevices: DeviceOutput[] | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesService.getDevices(req.ctx.userId!);
    if (foundDevices === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundDevices)
})

devicesRouter.delete('/', async (req: Request, res: Response) => {

})

devicesRouter.delete('/:deviceId', checkRefreshTokenMiddleware, async (req: RequestWithParams<{deviceId: string }>, res: Response) => {
    const deletionResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.NOT_FOUND | REPOSITORY_RESPONSES.FORBIDDEN | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await devicesService.deleteDeviceById(req.params.deviceId, req.ctx.userId!);
    if (deletionResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    if (deletionResult === REPOSITORY_RESPONSES.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    if (deletionResult === REPOSITORY_RESPONSES.FORBIDDEN) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

export default devicesRouter;