import {WithId} from "mongodb";
import {CommentDBType, OutputItemCommentType} from "./output";


export const commentMapper = (comment: WithId<CommentDBType>): OutputItemCommentType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: 'None'
        }
    }
}