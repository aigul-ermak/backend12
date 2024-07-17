import {NextFunction, Request, Response} from "express";
import {OutputItemPostType} from "../../types/post/output";
import {QueryPostRepo} from "../../repositories/post-repo/query-post-repo";

export const postExistsMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const postId = req.params.id
    const post: OutputItemPostType | null = await QueryPostRepo.getPostById(postId)

    if (!post) {
        res.sendStatus(404);
        return;
    }
    next()
}