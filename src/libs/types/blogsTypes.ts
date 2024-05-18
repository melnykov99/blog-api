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
type BlogOutput = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}
type OutputPagesBlogs = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogOutput[]
}
type CountAndBlogsDB = {
    totalCount: number,
    foundBlogs: Blog[]
}
type BlogsDbFilter = Record<string, never> | { name: {$regex: string; $options: string}}
type BlogFieldsForErrorMessages = 'name' | 'description' | 'websiteUrl';
export {OutputPagesBlogs, Blog, BlogInput, BlogFieldsForErrorMessages, CountAndBlogsDB, BlogsDbFilter, BlogOutput};