import {Router, Request, Response} from "express";
import {BlogModel} from "../models/blog";
import {PostModel} from "../models/post";
import {UserModel} from "../models/user";
import {SessionModel} from "../models/security";
import {RequestModel} from "../models/request";
import {CommentModel} from "../models/comment";
import {LikeCommentModel} from "../models/like";


export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {

     await BlogModel.deleteMany({});
     await PostModel.deleteMany({});
     await UserModel.deleteMany({});
     await SessionModel.deleteMany({});
     await RequestModel.deleteMany({});
     await CommentModel.deleteMany({});
     await LikeCommentModel.deleteMany({});


     res.sendStatus(204)
})