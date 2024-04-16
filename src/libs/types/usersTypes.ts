type User = {
    id: string,
    login: string,
    email: string,
    hash: string,
    createdAt: string,
    confirmationCode: string | null,
    codeExpirationDate: Date | null,
    isConfirmed: boolean,
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
    foundUsers: UserOutput[]
}
type UsersDbFilter =
    Record<string, never> |
    { login: { $regex: string; $options: string } } |
    { email: { $regex: string; $options: string } } |
    { login: { $regex: string; $options: string }, email: { $regex: string; $options: string } }
type UserFieldsForErrorMessages = 'login' | 'email' | 'password'

export {User, UserInput, UsersDbFilter, UsersDbOutput, UsersOutput, UserOutput, UserFieldsForErrorMessages};