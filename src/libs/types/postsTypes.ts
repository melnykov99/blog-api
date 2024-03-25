type Post = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
type PostFieldsForErrorMessages = 'title' | 'shortDescription' | 'content' | 'blogId';
export {Post, PostFieldsForErrorMessages};