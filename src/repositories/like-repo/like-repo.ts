import {CommentModel} from "../../models/comment";
import {LikeModel} from "../../models/like";
import {ObjectId} from "mongodb";
import {commentMapper} from "../../types/comment/mapper";
import {BlogModel} from "../../models/blog";
import {LIKE_STATUS, LikeDBModel, LikeType} from "../../types/like/output";


export class LikeRepo {

    async createLike(data: LikeType) {
        const res = await LikeModel.create(data);
        return res._id.toString();
    }

    async updateLike(id: string, updateData: any) {
        const res = await LikeModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                status: updateData.status,
                userId: updateData.userId,
                parentId: updateData.parentId,
            }
        })
        return !!res.matchedCount;

    }

    async getLike(parentId: string, userId: string) {
        const res = await LikeModel.findOne({parentId: parentId, userId: userId});
        return res;
    }

    async getNewestLikes(parentId: string) {
        return LikeModel.find({parentId: parentId, status: LIKE_STATUS.LIKE})
            .sort({createdAt: -1})
            .limit(3);
    }

    async checkLike(parentId: string, userId: string) {
        const res = await LikeModel.findOne({parentId: parentId, userId: userId}).lean();
        return !!res;
    }

//     async removeLike(parentId: string, userId: string) {
// const res = await LikeCommentModel.findOne({_id: parentId, userId: userId});
//
// if(!res) {
//     return false;
// }
//
//     }

    async makeStatus(like: any) {
        const res = await LikeModel.create(like)
        return res._id.toString();
    }

    async findLikeByCommentId(id: string) {
        const like = await LikeModel.findOne({_id: new ObjectId(id)})

        if (!like) {
            return null
        }
        return ({})
    }
}