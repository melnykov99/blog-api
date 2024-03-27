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
type PostFieldsForErrorMessages = 'title' | 'shortDescription' | 'content' | 'blogId';
export {Post, PostInput, PostInputWithoutBlog, PostFieldsForErrorMessages};