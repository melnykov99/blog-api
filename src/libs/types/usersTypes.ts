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
type UserInput = {
    login: string,
    password: string,
    email: string,
}
export {User, UserInput};