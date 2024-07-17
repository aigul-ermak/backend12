import {WithId} from "mongodb";
import {BlogDBType, OutputItemBlogType} from "./output";

export const blogMapper = (blog: WithId<BlogDBType>): OutputItemBlogType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}