type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}
type BlogFieldsForErrorMessages = 'name' | 'description' | 'websiteUrl';
export {Blog, BlogFieldsForErrorMessages};