type CommentDb = {
    id: string,
    content: string,
    postId: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
}
type CommentOutput = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
}
type CommentsOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentOutput[]
}
type CommentatorInfo = {
    userId: string,
    userLogin: string,
}
type CommentInput = {
    content: string,
}
type CommentsDbOutput = {
    totalCount: number,
    foundComments: CommentOutput[]
}
type CommentFieldsForErrorMessages = 'content';
type CommentsDbFilterByPostId = { postId: string };

export {
    CommentDb,
    CommentOutput,
    CommentsOutput,
    CommentatorInfo,
    CommentInput,
    CommentFieldsForErrorMessages,
    CommentsDbFilterByPostId,
    CommentsDbOutput
}