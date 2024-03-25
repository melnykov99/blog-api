import express from "express";
import {testingService} from "../services/testingService";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";

const deleteDataRouter = express.Router()

deleteDataRouter.delete('/', (req, res) => {
    testingService.deleteAllData()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

export default deleteDataRouter