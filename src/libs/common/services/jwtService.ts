import jwt, {JwtPayload} from "jsonwebtoken";
import {SERVICE_RESPONSES} from "../constants/repositoryResponse";
import {CustomJwtPayload} from "../../types/commonTypes";

const jwtService = {
    async createAccessToken(userId: string): Promise<string> {
        // Создание access токена, в него закладываем userId пользователя для которого генерируется токен
        return jwt.sign({userId: userId}, process.env.JWT_SECRET!, {expiresIn: "10s"});
    },
    async createRefreshToken(userId: string, deviceId: string): Promise<string> {
        // Создание refreshToken. Аналогично с access, но время жизни другое
        return jwt.sign({userId: userId, deviceId: deviceId}, process.env.JWT_SECRET!, {expiresIn: "20s"});
    },
    // Верификация jwt токена и получение userId из него
    async getUserIdByJWT(token: string): Promise<string | SERVICE_RESPONSES.UNAUTHORIZED | undefined> {
        // Если токен верифицировали, то достаем из payload userId
        try {
            const result: CustomJwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
            return result.userId;
        } catch (error) {
            // Если токен просрочился, то попадем в catch и вернем REPOSITORY_RESPONSES.UNAUTHORIZED
            return SERVICE_RESPONSES.UNAUTHORIZED;
        }
    },
    // Декодируем токен.
    // Может вернутся null, если токен недействителен/пуст, string, если токен сформирован неправильно без payload и JwtPayload в нормальном случае при успешном декодировании
    async getDecodedToken(token: string): Promise<string | JwtPayload | null> {
        return jwt.decode(token);
    },
};
export default jwtService;