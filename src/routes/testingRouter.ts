import express, {Request, Response, Router} from "express";
import {testingService} from "../services/testingService";
import {HTTP_STATUSES} from "../libs/common/constants/httpStatuses";
import {REPOSITORY_RESPONSES} from "../libs/common/constants/repositoryResponse";

const deleteDataRouter: Router = express.Router()

// Роут для удаления всех данных из БД
deleteDataRouter.delete('/', async (req: Request, res: Response) => {
    const deletionResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await testingService.deleteAllData()
    if (deletionResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

export default deleteDataRouter;