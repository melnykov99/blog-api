import express, {Request, Response} from "express";
import {videosService} from "../services/videosService";
import {REPOSITORY_RESPONSE} from "../libs/common/repositoryResponse";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import draftVideoErrorMessage from "../libs/common/errorMessages/videoErrorMessages";
import {AvailableResolutions, Video, VideoFieldsForErrorMessages} from "../libs/types/videosTypes";
import {ErrorsMessages} from "../libs/types/commonTypes";

const videosRouter = express.Router();

videosRouter.get('/', (req: Request, res: Response) => {
    const videos: Video[] = videosService.getAllVideos()
    res.send(videos);
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    const videoId: number = Number(req.params.id)
    const foundVideo: Video | REPOSITORY_RESPONSE.NOT_FOUND = videosService.getVideoById(videoId)
    if (foundVideo === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.status(HTTP_STATUSES.OK).send(foundVideo)
})

videosRouter.post('/', (req: Request, res: Response) => {
    const {title, author, availableResolutions} = req.body
    const errorFields: VideoFieldsForErrorMessages[] = []
    if (!title || typeof title !== 'string' || title.length > 40 || title.trim().length === 0) {
        errorFields.push('title')
    }
    if (!author || typeof author !== 'string' || title.length > 20 || author.trim().length === 0) {
        errorFields.push('author')
    }
    if (availableResolutions !== undefined) {
        if (availableResolutions instanceof Array) {
            availableResolutions.forEach(resolution => {
                if (!Object.values(AvailableResolutions).includes(resolution)) {
                    errorFields.push('availableResolutions')
                }
            })
        } else {
            errorFields.push('availableResolutions')
        }
    }
    if (errorFields.length) {
        const errorsMessages: ErrorsMessages = draftVideoErrorMessage(errorFields)
        res.status(HTTP_STATUSES.BAD_REQUEST).send(errorsMessages)
        return
    }
    videosService.createVideo(title, author, availableResolutions)
    res.sendStatus(HTTP_STATUSES.CREATED)
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    const videoId: number = Number(req.params.id)
    const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
    const errorFields: VideoFieldsForErrorMessages[] = []
    const isoDateRegex: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
    if (!title || typeof title !== 'string' || title.length > 40 || title.trim().length === 0) {
        errorFields.push('title')
    }
    if (!author || typeof author !== 'string' || title.length > 20 || author.trim().length === 0) {
        errorFields.push('author')
    }
    if (availableResolutions !== undefined) {
        if (availableResolutions instanceof Array) {
            availableResolutions.forEach(resolution => {
                if (!Object.values(AvailableResolutions).includes(resolution)) {
                    errorFields.push('availableResolutions')
                }
            })
        } else {
            errorFields.push('availableResolutions')
        }
    }
    if (canBeDownloaded !== undefined) {
        if (typeof canBeDownloaded !== 'boolean') {
            errorFields.push('canBeDownloaded')
        }
    }
    if (minAgeRestriction !== undefined) {
        if (typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1) {
            errorFields.push('minAgeRestriction')
        }
    }
    if (publicationDate !== undefined) {
        if (typeof publicationDate !== 'string' || !publicationDate.match(isoDateRegex)) {
            errorFields.push('publicationDate')
        }
    }
    if (errorFields.length) {
        const errorsMessages: ErrorsMessages = draftVideoErrorMessage(errorFields)
        res.status(HTTP_STATUSES.BAD_REQUEST).send(errorsMessages)
        return
    }
    const updatingResult: REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY = videosService.updateVideo(videoId, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)
    if (updatingResult === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const videoId: number = Number(req.params.id)
    const deletionResult: REPOSITORY_RESPONSE.NOT_FOUND | REPOSITORY_RESPONSE.SUCCESSFULLY = videosService.deleteVideoById(videoId)
    if (deletionResult === REPOSITORY_RESPONSE.NOT_FOUND) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

export default videosRouter