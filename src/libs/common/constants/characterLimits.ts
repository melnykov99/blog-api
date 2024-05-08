// Ограничение по символам для строк, где по документации (ТЗ) ограничений никаких нет. Сделано для защиты, чтобы запросами нам в БД тяжелые данные не накидали
enum COMMON_LIMITS {
    MIN = 1,
    MAX = 5000,
}
enum PASSWORD_LIMITS {
    MIN = 6,
    MAX = 20,
}
enum LOGIN_LIMITS {
    MIN = 3,
    MAX = 10,
}
const BLOG_LIMITS = {
    name: {max: 15},
    description: {max: 500},
    websiteUrl: {max: 500},
}
const COMMENT_LIMITS = {
    content: {min: 20, max: 300},
}
const POST_LIMITS = {
    title: {max: 30},
    shortDescription: {max: 100},
    content: {max: 1000},
}

export {COMMON_LIMITS, PASSWORD_LIMITS, LOGIN_LIMITS, BLOG_LIMITS, COMMENT_LIMITS, POST_LIMITS}