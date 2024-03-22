type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}
type BlogFieldsForErrorMessages = 'name' | 'description' | 'websiteUrl';
export {Blog, BlogFieldsForErrorMessages};