import express from "express";
import {testingService} from "../services/testingService";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";

export const deleteDataRouter = express.Router()

deleteDataRouter.delete('/', (req, res) => {
    testingService.deleteAllVideos()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})