import {CreatePostData, SortPostType, UpdatePostData} from "../../types/post/input";
import {NewsLike, OutputItemPostType, OutputPostType, PostDBType} from "../../types/post/output";
import {ObjectId, WithId} from "mongodb";
import {QueryBlogRepo} from "../blog-repo/query-blog-repo";
import {PostModel} from "../../models/post";
import {LikeModel} from "../../models/like";
import {LikeRepo} from "../like-repo/like-repo";

export class PostRepo {
    //TODO any here
    async createPostToBlog(newData: any) {

        const res = await PostModel.create(newData);
        return res._id.toString();
    }

    async createPost(data: CreatePostData): Promise<string | null> {
        try {
            const res = await PostModel.create(data);
            return res._id.toString();
        } catch (e) {
            console.log(e);
            return null;
        }

    }

    async updatePost(id: string, updateData: UpdatePostData): Promise<boolean> {
        const blog = await QueryBlogRepo.getBlogById(updateData.blogId)

        const res = await PostModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: updateData.title,
                shortDescription: updateData.shortDescription,
                content: updateData.content,
                blogId: updateData.blogId,
                blogName: blog?.name
            }
        })
        return !!res.matchedCount;
    }


    async getAllPosts(sortData: SortPostType): Promise<OutputPostType> {

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


        const totalCount = await PostModel.countDocuments(filter);
        const userId = "";
        const pageCount = Math.ceil(totalCount / +pageSize);

        const items: any[] = await Promise.all(posts.map(async (post) => {
            const postLike = await LikeModel.findOne({parentId: post._id, userId: userId});
            const status = postLike ? postLike.status : 'None';

            let newestLikes = await LikeModel.find({ parentId: post.id })
                .sort({ createdAt: -1 })
                .limit(3);
            const formattedNewestLikes = newestLikes.length === 0 ? [] : newestLikes.map(like => ({
                addedAt: like.createdAt,
                userId: like.userId,
                login: like.login,
            }));

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
                    newestLikes: formattedNewestLikes,
                }
            };
        }));

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items,
            //items: posts.map(postMapper)
        }
    }

    async getPostById(id: string): Promise<OutputItemPostType | null> {

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
                newestLikes: [] as NewsLike[]
            }
        };
    }

    async getPostsByBlogId(blogId: string, sortData: SortPostType) {

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

    async deletePost(id: string): Promise<boolean> {
        const res = await PostModel.deleteOne({_id: new ObjectId(id)});

        return !!res.deletedCount;
    }

    async incrementLikeCount(id: string) {
        await PostModel.updateOne({_id: new ObjectId(id)}, {
            $inc: {likesCount: 1}
        });
    }


    async decrementLikeCount(id: string) {
        await PostModel.updateOne({_id: new ObjectId(id)}, {
            $inc: {likesCount: -1}
        });
    }

    async incrementDislikeCount(id: string) {
        await PostModel.updateOne({_id: new ObjectId(id)}, {
            $inc: {dislikesCount: 1}
        });
    }

    async decrementDislikeCount(id: string) {
        await PostModel.updateOne({_id: new ObjectId(id)}, {
            $inc: {dislikesCount: -1}
        });
    }
}