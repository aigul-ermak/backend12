export type UpdatePostData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type CreatePostData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type SortPostType = {
    sortBy?: string,
    sortDirection?: 'acs' | 'desc',
    pageNumber?: number,
    pageSize?: number
}

