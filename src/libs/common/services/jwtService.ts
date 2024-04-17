import jwt from "jsonwebtoken";

const jwtService = {
    async createJWT(userId: string) {
        // Создание jwt токена, в него закладываем userId пользователя для которого генерируется токен
        // Срок жизни jwt токена 1 час
        return jwt.sign({userId: userId}, process.env.JWT_SECRET!, {expiresIn: '1h'})
    },
    async getUserIdByJWT(token: string): Promise<string | undefined> {
        try {
            // Верификация jwt токена и получение userId из него
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId
        } catch (error) {
            return
        }
    }
}
export default jwtService;