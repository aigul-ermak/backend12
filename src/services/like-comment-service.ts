import {LikeCommentRepo} from "../repositories/like-repo/like-comment-repo";
import {LIKE_STATUS, LikeDBModel} from "../types/like/output";
import {CommentRepo} from "../repositories/comment-repo/comment-repo";
import {UserRepo} from "../repositories/user-repo/user-repo";


export class LikeCommentService {
    constructor(protected likeCommentRepo: LikeCommentRepo, protected commentRepo: CommentRepo, protected userRepo: UserRepo) {
    }

    async createStatus(userId: string, likeStatus: LIKE_STATUS, parentId: string) {

        const isLikeExist = await this.likeCommentRepo.checkLike(parentId, userId);
        let like;

        const user = await this.userRepo.


        if (!isLikeExist) {
            const newLike = {
                status: likeStatus,
                userId,
                parentId,
                login: user
                createdAt: Date.now(),
            };

            const res = await this.likeCommentRepo.createLike(newLike);

            if (likeStatus == LIKE_STATUS.LIKE) {
                await this.commentRepo.incrementLikeCount(parentId);
            } else if (like!.status === LIKE_STATUS.DISLIKE) {
                await this.commentRepo.incrementDislikeCount(parentId);
            }
            return res;
        } else {
            like = await this.likeCommentRepo.getLike(parentId, userId);
            if (like!.status !== likeStatus) {
                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.commentRepo.decrementLikeCount(parentId);
                } else if (like!.status === LIKE_STATUS.DISLIKE) {
                    await this.commentRepo.decrementDislikeCount(parentId);
                }

                if (likeStatus === LIKE_STATUS.LIKE) {
                    await this.commentRepo.incrementLikeCount(parentId);
                } else if (likeStatus === LIKE_STATUS.DISLIKE) {
                    await this.commentRepo.incrementDislikeCount(parentId);
                }
            }
            like!.status = likeStatus;

            return await this.likeCommentRepo.updateLike(like!._id.toString(), like);
        }
    }

    async getLike(parentId: string, userId: string,): Promise<LikeDBModel | null> {
        return await this.likeCommentRepo.getLike(parentId, userId)
    }

    async getNewestLikes(parentId: string) {
        return await this.likeCommentRepo.getNewestLikes(parentId);
    }
}