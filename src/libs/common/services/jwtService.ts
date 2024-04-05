import jwt from "jsonwebtoken";

const jwtService = {
    async createJWT(userId: string) {
        return jwt.sign({userId: userId}, process.env.JWT_SECRET!, {expiresIn: '1h'})
    },
    async getUserIdByJWT(token: string): Promise<string | undefined> {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId
        } catch (error) {
            return
        }
    }
}
export default jwtService;