export type UpdateBlogData = {
    name: string,
    description: string,
    websiteUrl: string
}

export type CreateBlogData = {
    name: string,
    description: string,
    websiteUrl: string
}


export type SortDataType = {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: 'acs' | 'desc',
    pageNumber?: number,
    pageSize?: number
}