type Post = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
type PostOutput = {
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
type OutputPagesPosts = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Post[]
}
type CountAndPostsDB = {
    totalCount: number,
    foundPosts: Post[]
}
type PostsDbFilterByBlogId = {blogId: string}
type PostsDbFilter = Record<string, never>
type PostFieldsForErrorMessages = 'title' | 'shortDescription' | 'content' | 'blogId';
export {OutputPagesPosts, Post, PostInput, PostInputWithoutBlog, CountAndPostsDB, PostFieldsForErrorMessages, PostsDbFilter, PostsDbFilterByBlogId, PostOutput};