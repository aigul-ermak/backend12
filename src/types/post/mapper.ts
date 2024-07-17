import {WithId} from "mongodb";
import {OutputItemPostType, PostDBType} from "./output";


export const postMapper = (post: WithId<PostDBType>): OutputItemPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}