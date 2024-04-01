type User = {
    id: string,
    login: string,
    email: string,
    hash: string,
    createdAt: string,
}
type UserOutput = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
}
type UsersOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserOutput[]
}
type UserInput = {
    login: string,
    password: string,
    email: string,
}
type UsersDbOutput = {
    totalCount: number,
    foundUsers: User[]
}
type UsersDbFilter =
    Record<string, never> |
    { login: { $regex: string; $options: string } } |
    { email: { $regex: string; $options: string } } |
    { login: { $regex: string; $options: string }, email: { $regex: string; $options: string } }
export {User, UserInput, UsersDbFilter, UsersDbOutput, UsersOutput};