import {CreatePostData, SortPostType, UpdatePostData} from "../../types/post/input";
import {OutputItemPostType, OutputPostType, PostDBType} from "../../types/post/output";
import {ObjectId, WithId} from "mongodb";
import {BlogDBType} from "../../types/blog/output";
import {QueryBlogRepo} from "../blog-repo/query-blog-repo";
import {PostModel} from "../../models/post";
import {PostService} from "../../services/post-service";
import {BlogModel} from "../../models/blog";
import {postMapper} from "../../types/post/mapper";

export class PostRepo {
    //TODO any here
    async createPostToBlog(newData: any) {

        const res = await PostModel.create(newData);
        return res._id.toString();
        //TODO delete
        //return res.insertedId.toString();
    }

    async createPost(data: CreatePostData): Promise<string | null> {
        try {
            const res = await PostModel.create(data);
            return res._id.toString();
        } catch(e) {
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
            .sort({[sortBy]: sortDirection === 'desc' ? -1: 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .exec();
        //.toArray();

        const totalCount = await PostModel.countDocuments(filter);

        const pageCount = Math.ceil(totalCount / +pageSize);

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: posts.map(postMapper)
        }
    }

    async getPostById(id: string): Promise<OutputItemPostType | null> {
        const post: WithId<PostDBType> | null = await PostModel.findOne({_id: new ObjectId(id)})

        if (!post) {
            return null
        }
        return postMapper(post)
    }

    async getPostsByBlogId(blogId: string, sortData:SortPostType ) {

        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const pageSize = sortData.pageSize ?? 10
        const pageNumber = sortData.pageNumber ?? 1

        const posts = await PostModel
            .find({blogId: blogId})
            .sort({[sortBy]: sortDirection === 'desc' ? -1: 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .exec();
        //.toArray();

        const totalCount = await PostModel.countDocuments({blogId: blogId});

        const pageCount = Math.ceil(totalCount / +pageSize);

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: posts.map(postMapper)
        }
    }

     async deletePost(id: string): Promise<boolean> {
        const res = await PostModel.deleteOne({_id: new ObjectId(id)});

        return !!res.deletedCount;
    }
}