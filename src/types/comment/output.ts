export type CommentDBType = {
    postId: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
    likesCount: number,
    dislikesCount: number,
}

type CommentatorInfo = {
    userId: string,
    userLogin: string
}

export type OutputItemCommentType = {
    id: string,
    // postId: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    };
}

export type OutputCommentType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputItemCommentType[]
}

export type SortCommentType = {
    sortBy?: string,
    sortDirection?: 'acs' | 'desc',
    pageNumber?: number,
    pageSize?: number
};

