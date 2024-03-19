type CommonError = {
    message: string,
    field: string
}
type ErrorsMessages = {
    errorsMessages: CommonError[]
}

export {CommonError, ErrorsMessages};