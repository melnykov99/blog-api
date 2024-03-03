import express, {Request, Response} from "express";
import {videosService} from "../services/videosService";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import {errorMessages} from "../libs/videos/errorMessages";

export const videosRouter = express.Router();

videosRouter.get('/', (req: Request, res: Response) => {
    const videos = videosService.getAllVideos()
    res.send(videos);
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    const videoId = Number(req.params.id)
    const foundVideo = videosService.getVideoById(videoId)
    if (foundVideo === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundVideo)
})

videosRouter.post('/', (req, res) => {
    //TODO
    const {title} = req.body
    console.log(title)
    if (!title || typeof title !== "string" || title.length > 40) {
        res.status(HTTP_STATUSES.BAD_REQUEST).send(errorMessages)
        return
    }
    res.status(HTTP_STATUSES.CREATED).send(title)
})

videosRouter.put('/:id', (req, res) => {

})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const videoId = Number(req.params.id)
    const deletionResult = videosService.deleteVideoById(videoId)
    if (deletionResult === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})