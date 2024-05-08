//TODO: разделить константы нужно, здесь есть те, которые не используются в repository И пересмотреть использование этих констант. Сейчас кошмарно выглядит код с ними. Наверное стоит только в репозитории использовать
export enum REPOSITORY_RESPONSES {
    NOT_FOUND = "Element not found by input parameters",
    SUCCESSFULLY = "Action completed successfully",
    UNSUCCESSFULLY = "An error occurred during execution",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden"
}