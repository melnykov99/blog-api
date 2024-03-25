import express from "express";
import {testingService} from "../services/testingService";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import {REPOSITORY_RESPONSES} from "../libs/common/repositoryResponse";

const deleteDataRouter = express.Router()

deleteDataRouter.delete('/', async (req, res) => {
    const deletionResult: REPOSITORY_RESPONSES.SUCCESSFULLY | REPOSITORY_RESPONSES.UNSUCCESSFULLY = await testingService.deleteAllData()
    if (deletionResult === REPOSITORY_RESPONSES.UNSUCCESSFULLY) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

export default deleteDataRouter