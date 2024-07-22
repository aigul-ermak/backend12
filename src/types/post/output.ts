export type OutputItemPostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: string,
        newestLikes: NewsLike[]
    }
}

export type OutputPostType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputItemPostType[]
}


export type PostDBType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    likesCount: number,
    dislikesCount: number,
}

export type NewsLike = { addedAt: string,
    userId: string,
    login: string,}

export type OutputCreatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: string,
        newestLikes:NewsLike[]
    }
}