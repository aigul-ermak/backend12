import {OutputItemPostType, OutputPostType, PostDBType} from "../../types/post/output";
import {ObjectId, WithId} from "mongodb";
import {SortPostType} from "../../types/post/input";
import {PostModel} from "../../models/post";
import {LikeModel} from "../../models/like";

export class QueryPostRepo {
    static async getAllPosts(sortData: SortPostType): Promise<OutputPostType> {

        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const pageSize = sortData.pageSize ?? 10
        const pageNumber = sortData.pageNumber ?? 1

        let filter = {}

        const posts = await PostModel
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .exec();
        //.toArray();

        const totalCount = await PostModel.countDocuments(filter);

        const pageCount = Math.ceil(totalCount / +pageSize);
        const userId = "";
        const items: any[] = await Promise.all(posts.map(async (post) => {
            const postComment = await LikeModel.findOne({parentId: post._id, userId: userId});
            const status = postComment ? postComment.status : 'None';

            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: status,
                    newestLikes: [
                        {
                            addedAt: "",
                            userId: "",
                            login: "",
                        }
                    ]
                }
            };
        }));

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items,
        }
    }

    static async getPostById(id: string): Promise<OutputItemPostType | null> {
        const post: WithId<PostDBType> | null = await PostModel.findOne({_id: new ObjectId(id)})

        if (!post) {
            return null
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likesCount,
                dislikesCount: post.dislikesCount,
                myStatus: "None",
                newestLikes: [
                    {
                        addedAt: "",
                        userId: "",
                        login: "",
                    }
                ]
            }
        };
    }

    static async getPostsByBlogId(blogId: string, sortData: SortPostType) {

        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const pageSize = sortData.pageSize ?? 10
        const pageNumber = sortData.pageNumber ?? 1

        const posts = await PostModel
            .find({blogId: blogId})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .exec();
        //.toArray();

        const totalCount = await PostModel.countDocuments({blogId: blogId});

        const pageCount = Math.ceil(totalCount / +pageSize);
        const userId = "";
        const items: any[] = await Promise.all(posts.map(async (post) => {
            const postComment = await LikeModel.findOne({parentId: post._id, userId: userId});
            const status = postComment ? postComment.status : 'None';

            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: status,
                    newestLikes: [
                        {
                            addedAt: "",
                            userId: "",
                            login: "",
                        }
                    ]
                }
            };
        }));

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items
        }
    }
}