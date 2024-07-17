import {Request, Response, Router} from "express";
import {ErrorType, RequestBodyAndParams, RequestWithBody, RequestWithParams, Body} from "../types/common";
import {AvailableResolutions} from "../types/video/output";
import {UpdateVideoDto} from "../types/video/input";


export const videosRouter = Router({})
export type Params = {
    id: string
}
// videosRouter.delete('/testing/all-data', (reg: Request, res: Response) => {
//
//     db.videos.splice(0, db.videos.length)
//     return res.sendStatus(204)
//
// })
// videosRouter.get('/videos', (req: Request, res: Response) => {
//
//     res.status(200).send(db.videos)
//
// })
// videosRouter.get('/:id', (req: RequestWithParams<{ id: Params }>, res: Response) => {
//     const id = +req.params.id;
//     const video = db.videos.find((v) => v.id === id);
//
//     if (!video) {
//         return res.sendStatus(404)
//     }
//
//     res.send(video);
//     return;
// });

// videosRouter.post('/videos', (req: RequestWithBody<Body>, res: Response) => {
//
//     let error: ErrorType = {
//         errorsMessages: []
//     }
//
//     let {title, author, availableResolutions}: Body = req.body
//
//     if (!title || title.trim().length < 1 || title.trim().length > 40) {
//         error.errorsMessages.push({message: "Error", field: "title"})
//     }
//
//     if (!author || author.trim().length < 1 || author.trim().length > 20) {
//         error.errorsMessages.push({message: "Error", field: "author"})
//     }
//
//     if (Array.isArray(availableResolutions)) {
//         availableResolutions.map((r) => {
//             !AvailableResolutions.includes(r) && error.errorsMessages.push({
//                 message: "Invalid availableResolutions",
//                 field: "availableResolutions"
//             })
//         })
//     } else {
//         availableResolutions = []
//     }
//
//     if (error.errorsMessages.length) {
//         res.status(400).send(error)
//         return
//     }
//
//     const createdAt = new Date()
//     const publicationDate = new Date()
//
//     publicationDate.setDate(createdAt.getDate() + 1)
//
//     const newVideo = {
//         id: +(new Date()),
//         canBeDownloaded: false,
//         minAgeRestriction: null,
//         createdAt: createdAt.toISOString(),
//         publicationDate: publicationDate.toISOString(),
//         title,
//         author,
//         availableResolutions
//     }
//
//     db.videos.push(newVideo)
//
//     res.status(201).send(newVideo)
// })
//
//
// videosRouter.put('/videos/:id', (req: RequestBodyAndParams<Params, UpdateVideoDto>, res) => {
//     const id = +req.params.id
//
//     let error: ErrorType = {
//         errorsMessages: []
//     }
//
//     let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate}:UpdateVideoDto = req.body
//
//     if (!title || title.trim().length < 1 || title.trim().length > 40) {
//         error.errorsMessages.push({message: "Invalid title", field: "title"})
//     }
//
//     if (!author || author.trim().length < 1 || author.trim().length > 20) {
//         error.errorsMessages.push({message: "Invalid author", field: "author"})
//     }
//
//     if (Array.isArray(availableResolutions)) {
//         availableResolutions.map((r) => {
//             !AvailableResolutions.includes(r) && error.errorsMessages.push({
//                 message: "Invalid availableResolutions",
//                 field: "availableResolutions"
//             })
//         })
//     } else {
//         availableResolutions = []
//     }
//
//     if (typeof canBeDownloaded === "undefined") {
//         canBeDownloaded = false
//     }
//
//     if(typeof canBeDownloaded !== "boolean") {
//         error.errorsMessages.push({
//             message: "Invalid canBeDownLoaded",
//             field: "canBeDownloaded"
//         })
//     }
//
//     if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction === "number") {
//         minAgeRestriction < 1 || minAgeRestriction > 18
//         && error.errorsMessages.push({message: "Invalid minAgeRestriction", field: "minAgeRestriction"})
//     } else {
//         minAgeRestriction = null
//     }
//
//     const pDate: boolean = (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/gi).test(publicationDate);
//     if(typeof publicationDate !== "undefined" && !pDate){
//         error.errorsMessages.push({
//             message: "Invalid publicationDate",
//             field: "publicationDate"
//         })
//     }
//
//     if (error.errorsMessages.length) {
//         res.status(400).send(error)
//         return
//     }
//
//     const videoIndex = db.videos.findIndex(v => v.id === id)
//
//     const video = db.videos.find(v => v.id === id)
//
//     if (!video) {
//         res.sendStatus(404)
//         return;
//     }
//
//     const updatedItem = {
//         ...video,
//         availableResolutions: availableResolutions,
//         canBeDownloaded,
//         minAgeRestriction,
//         title,
//         author,
//         publicationDate: publicationDate ? publicationDate : video.publicationDate
//     }
//
//     db.videos.splice(videoIndex, 1, updatedItem)
//
//     res.send(204)
// })
//
// videosRouter.delete('/videos/:id', (req: RequestBodyAndParams<Params, any>, res) => {
//     const id = +req.params.id;
//
//     let error: ErrorType = {
//         errorsMessages: []
//     }
//
//     const videoIndex = db.videos.findIndex(v => v.id === id)
//
//     if (videoIndex === -1) {
//         res.sendStatus(404);
//         return;
//     }
//
//     db.videos.splice(videoIndex, 1);
//
//     if (error.errorsMessages.length) {
//         res.status(400).send(error)
//         return
//     }
//     res.send(204)
//
// })
//
