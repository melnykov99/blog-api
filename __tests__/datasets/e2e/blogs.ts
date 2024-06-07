const validBlogBody = {
    name: 'blog name',
    description: 'blog description',
    websiteUrl: 'https://validurl.com'
}
const invalidBlogBody = {

}
const blogsEmptyResponse = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: []
}

export {validBlogBody, invalidBlogBody, blogsEmptyResponse}