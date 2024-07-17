import {CreateBlogData, SortDataType, UpdateBlogData} from "../../types/blog/input";
import {BlogDBType, OutputBlogType, OutputItemBlogType} from "../../types/blog/output";
import mongoose from "mongoose";
import {BlogModel, blogSchema} from "../../models/blog";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "../../types/blog/mapper";
import {SortPostType} from "../../types/post/input";
import {OutputItemPostType, OutputPostType, PostDBType} from "../../types/post/output";
import {PostModel} from "../../models/post";
import {postMapper} from "../../types/post/mapper";


export class BlogRepo {
    //static async createBlog(data: BlogType): Promise<string | null> {
    async createBlog(data: BlogDBType) {
        try {
            const res = await BlogModel.create(data);
            return res._id.toString();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async updateBlog(id: string, updateData: UpdateBlogData): Promise<boolean> {
        const res = await BlogModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updateData.name,
                description: updateData.description,
                websiteUrl: updateData.websiteUrl
            }
        })
        return !!res.matchedCount;
    }

    async deleteBlog(id: string): Promise<boolean> {
        const res = await BlogModel.deleteOne({_id: new ObjectId(id)});

        return !!res.deletedCount;
    }

    async getAllBlogs(sortData: SortDataType): Promise<OutputBlogType> {

        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const searchNameTerm = sortData.searchNameTerm ?? null
        const pageSize = sortData.pageSize ?? 10
        const pageNumber = sortData.pageNumber ?? 1

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }
        //TODO type?
        //const blogs: WithId<BlogType>[] = await BlogModel.find(filter)
        //const blogs: BlogDBType[] = await BlogModel.find(filter)
        const blogs: any = await BlogModel.find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .exec();
        //.toArray();

        const totalCount: number = await BlogModel.countDocuments(filter);

        const pageCount: number = Math.ceil(totalCount / +pageSize);

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: blogs.map(blogMapper)
        }
    }

    async getBlogById(id: string): Promise<OutputItemBlogType | null> {
//TODO return type?
        const blog: any | null = await BlogModel.findById(id);

        if (!blog) {
            return null;
        }
        return blogMapper(blog)
    }
}