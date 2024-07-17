import {SortDataType} from "../../types/blog/input";
import {blogMapper} from "../../types/blog/mapper";
import {BlogDBType, OutputBlogType, OutputItemBlogType} from "../../types/blog/output";
import {BlogModel, blogSchema} from "../../models/blog";
import {WithId} from "mongodb";

export class QueryBlogRepo {
    static async getAllBlogs(sortData: SortDataType): Promise<OutputBlogType> {

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

    static async getBlogById(id: string): Promise<OutputItemBlogType | null> {
//TODO return type?
        const blog: any | null = await BlogModel.findById(id);

        if (!blog) {
            return null;
        }
        return blogMapper(blog)

    }
}