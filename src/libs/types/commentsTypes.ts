type CommentDb = {
    id: string,
    content: string,
    postId: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
}
type Commentary = {
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
    items: Commentary[]
}
type CommentatorInfo = {
    userId: string,
    userLogin: string,
}
type CommentInput = {
    content: string,
}
type CommentFieldsForErrorMessages = 'content';
type CommentsDbFilterByPostId = {postId: string}
export {CommentDb, Commentary, CommentsOutput, CommentatorInfo, CommentInput, CommentFieldsForErrorMessages, CommentsDbFilterByPostId}