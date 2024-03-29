type BlogsOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Blog[]
}
type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}
type BlogInput = {
    name: string,
    description: string,
    websiteUrl: string,
}
type BlogsDbOutput = {
    totalCount: number,
    foundBlogs: Blog[]
}
type BlogsDbFilter = Record<string, never> | { name: {$regex: string; $options: string}}
type BlogFieldsForErrorMessages = 'name' | 'description' | 'websiteUrl';
export {BlogsOutput, Blog, BlogInput, BlogFieldsForErrorMessages, BlogsDbOutput, BlogsDbFilter};