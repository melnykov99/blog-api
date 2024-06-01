enum REPOSITORY_RESPONSES {
    NOT_FOUND = 'Element not found by input parameters',
    SUCCESSFULLY = 'Action completed successfully',
    UNSUCCESSFULLY = 'An error occurred during execution',
}
enum SERVICE_RESPONSES {
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden'
}

export {SERVICE_RESPONSES, REPOSITORY_RESPONSES}