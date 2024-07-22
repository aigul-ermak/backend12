import {LIKE_STATUS, LikeDBModel} from "../types/like/output";
import {CommentRepo} from "../repositories/comment-repo/comment-repo";
import {UserRepo} from "../repositories/user-repo/user-repo";
import {PostRepo} from "../repositories/post-repo/post-repo";
import {LikeRepo} from "../repositories/like-repo/like-repo";



export class LikeCommentService {
    constructor(protected likeRepo: LikeRepo, protected commentRepo: CommentRepo, protected userRepo: UserRepo, protected postRepo: PostRepo) {
    }

    async createCommentStatus(userId: string, likeStatus: LIKE_STATUS, parentId: string) {

        const isLikeExist = await this.likeRepo.checkLike(parentId, userId);
        let like;

        const user = await this.userRepo.findUserById(userId);

        if (!isLikeExist) {
            const newLike = {
                status: likeStatus,
                userId,
                parentId,
                login: user?.accountData.login,
                createdAt: Date.now(),
            };

            const res = await this.likeRepo.createLike(newLike);

            if (likeStatus == LIKE_STATUS.LIKE) {
                await this.commentRepo.incrementLikeCount(parentId);
            } else if (likeStatus === LIKE_STATUS.DISLIKE) {
                await this.commentRepo.incrementDislikeCount(parentId);
            }
            return res;
        } else {
            like = await this.likeRepo.getLike(parentId, userId);
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

            return await this.likeRepo.updateLike(like!._id.toString(), like);
        }
    }

    async createPostStatus(userId: string, likeStatus: LIKE_STATUS, parentId: string) {

        const isLikeExist = await this.likeRepo.checkLike(parentId, userId);
        let like;

        const user = await this.userRepo.findUserById(userId);

        if (!isLikeExist) {
            const newLike = {
                status: likeStatus,
                userId,
                parentId,
                login: user?.accountData.login,
                createdAt: Date.now(),
            };

            const res = await this.likeRepo.createLike(newLike);

            if (likeStatus == LIKE_STATUS.LIKE) {
                await this.postRepo.incrementLikeCount(parentId);
            } else if (likeStatus === LIKE_STATUS.DISLIKE) {
                await this.postRepo.incrementDislikeCount(parentId);
            }
            return res;
        } else {
            like = await this.likeRepo.getLike(parentId, userId);
            if (like!.status !== likeStatus) {
                if (like!.status === LIKE_STATUS.LIKE) {
                    await this.postRepo.decrementLikeCount(parentId);
                } else if (like!.status === LIKE_STATUS.DISLIKE) {
                    await this.postRepo.decrementDislikeCount(parentId);
                }

                if (likeStatus === LIKE_STATUS.LIKE) {
                    await this.postRepo.incrementLikeCount(parentId);
                } else if (likeStatus === LIKE_STATUS.DISLIKE) {
                    await this.postRepo.incrementDislikeCount(parentId);
                }
            }
            like!.status = likeStatus;

            return await this.likeRepo.updateLike(like!._id.toString(), like);
        }
    }


    async getLike(parentId: string, userId: string,): Promise<LikeDBModel | null> {
        return await this.likeRepo.getLike(parentId, userId)
    }

    async getNewestLikes(parentId: string) {
        return await this.likeRepo.getNewestLikes(parentId);
    }
}