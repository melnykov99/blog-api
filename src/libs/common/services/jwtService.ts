import jwt from "jsonwebtoken";
import {REPOSITORY_RESPONSES} from "../constants/repositoryResponse";

const jwtService = {
    async createAccessToken(userId: string) {
        // Создание access токена, в него закладываем userId пользователя для которого генерируется токен
        return jwt.sign({userId: userId}, process.env.JWT_SECRET!, {expiresIn: '10s'})
    },
    async createRefreshToken(userId: string) {
        // Создание refreshToken. Аналогично с access, но время жизни другое
        return jwt.sign({userId: userId}, process.env.JWT_SECRET!, {expiresIn: '20s'})
    },
    // Верификация jwt токена и получение userId из него
    async getUserIdByJWT(token: string): Promise<string | REPOSITORY_RESPONSES.UNAUTHORIZED | undefined> {
        // Если токен верифицировали, то достаем из payload userId
        try {
            //TODO: any не должно быть
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId
        } catch (error) {
            // Если токен просрочился, то попадем в catch и вернем REPOSITORY_RESPONSES.UNAUTHORIZED
            return REPOSITORY_RESPONSES.UNAUTHORIZED
        }
    },
    //TODO: any не должно быть
    async getDecodedToken(token: string): Promise<any> {
        return jwt.decode(token)
    }
}
export default jwtService;