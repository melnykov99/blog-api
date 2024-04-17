//TODO: разделить константы нужно, здесь есть те, которые не используются в repository
export enum REPOSITORY_RESPONSES {
    NOT_FOUND = "Element not found by input parameters",
    SUCCESSFULLY = "Action completed successfully",
    UNSUCCESSFULLY = "An error occurred during execution",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden"
}