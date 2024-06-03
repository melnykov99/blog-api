type CommentatorInfo = {
    userId: string,
    userLogin: string,
}
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
type CommentInput = {
    content: string,
}
type OutputPagesComments = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentOutput[]
}
type CountAndCommentsDB = {
    totalCount: number,
    foundComments: CommentDb[]
}
type CommentFieldsForErrorMessages = "content";
type CommentsDbFilterByPostId = { postId: string };

export {
    CommentDb,
    CommentOutput,
    OutputPagesComments,
    CommentatorInfo,
    CommentInput,
    CommentFieldsForErrorMessages,
    CommentsDbFilterByPostId,
    CountAndCommentsDB,
};