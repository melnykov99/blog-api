import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../libs/common/httpStatuses";
import postsService from "../services/postsService";
import {Post} from "../libs/types/postsTypes";

const postsRouter = express.Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const foundPosts: Post[] = postsService.getPosts()
    res.status(HTTP_STATUSES.OK).send(foundPosts)
})
postsRouter.post('/', (req: Request, res: Response) => {

    res.status(HTTP_STATUSES.CREATED).send()
})

postsRouter.get('/:id', (req: Request, res: Response) => {

    res.status(HTTP_STATUSES.OK).send()
})

postsRouter.put('/:id', (req: Request, res: Response) => {

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

postsRouter.delete('/:id', (req: Request, res: Response) => {

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})


export default postsRouter;