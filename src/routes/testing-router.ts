import {Router, Request, Response} from "express";
import {BlogModel} from "../models/blog";
import {PostModel} from "../models/post";
import {UserModel} from "../models/user";
import {SessionModel} from "../models/security";
import {RequestModel} from "../models/request";
import {CommentModel} from "../models/comment";
import {LikeModel} from "../models/like";


export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {

     await BlogModel.deleteMany({});
     await PostModel.deleteMany({});
     await UserModel.deleteMany({});
     await SessionModel.deleteMany({});
     await RequestModel.deleteMany({});
     await CommentModel.deleteMany({});
     await LikeModel.deleteMany({});


     res.sendStatus(204)
})