type PostsOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Post[]
}
type Post = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
type PostInput = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
}
type PostInputWithoutBlog = {
    title: string,
    shortDescription: string,
    content: string,
}
type PostsDbOutput = {
    totalCount: number,
    foundPosts: Post[]
}
type PostsDbFilterByBlogId = {blogId: string}
type PostsDbFilter = Record<string, never>
type PostFieldsForErrorMessages = 'title' | 'shortDescription' | 'content' | 'blogId';
export {PostsOutput, Post, PostInput, PostInputWithoutBlog, PostsDbOutput, PostFieldsForErrorMessages, PostsDbFilter, PostsDbFilterByBlogId};