import {BlogDBType, OutputItemBlogType} from "../types/blog/output";
import {InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import {blogMapper} from "../types/blog/mapper";
import {CreateBlogData, SortDataType, UpdateBlogData} from "../types/blog/input";
import {BlogModel} from "../models/blog";

export class BlogRepository {
    static async getAllBlogs(sortData: SortDataType) {
        const sortDirection: string = sortData.sortDirection ?? 'desc'
        const sortBy: string = sortData.sortBy ?? 'createdAt'
        const searchNameTerm: string | null = sortData.searchNameTerm ?? null
        const pageSize : number = sortData.pageSize ?? 10
        const pageNumber : number = sortData.pageNumber ?? 1

        let filter = {}

        if(searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }

        const blogs = await BlogModel
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1: 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize);
            // .toArray();

        // const totalCount : number = await blogCollection.countDocuments(filter);
        //
        // const pageCount: number = Math.ceil(totalCount / +pageSize);

        // return {
        //     pageCount: pageCount,
        //     page: +pageSize,
        //     pageSize: +pageSize,
        //     totalCount: totalCount,
        //     items: blogs.map(blogMapper)
        // }
    }

    static async getBlogById(id: string): Promise<OutputItemBlogType | null> {

        const blog: any| null = await BlogModel.findOne({id: id});

        if (!blog) {
            return null
        }
        return blogMapper(blog)
    }

    //tatic async createBlog(data: CreateBlogData) : Promise<String> {
    static async createBlog(data: CreateBlogData)  {

        const newBlog: BlogDBType = {
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        // const res: InsertOneResult<BlogType> = await BlogModel.insertMany(newBlog);
        // return res.insertedId.toString();
    }


    static async updateBlog(id: string, updateData: UpdateBlogData): Promise<boolean> {
        const res: UpdateResult<BlogDBType> = await BlogModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updateData.name,
                description: updateData.description,
                websiteUrl: updateData.websiteUrl
            }
        })
        return !!res.matchedCount;
    }

    static async deleteBlog(id: string): Promise<boolean> {
        const res = await BlogModel.deleteOne({_id: new ObjectId(id)});

        return !!res.deletedCount;
    }
}