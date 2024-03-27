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
type BlogFieldsForErrorMessages = 'name' | 'description' | 'websiteUrl';
export {Blog, BlogInput, BlogFieldsForErrorMessages};