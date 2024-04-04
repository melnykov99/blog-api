type AuthLogin = {
    loginOrEmail: string,
    password: string
}
type AuthMeUserInfo = {
    email: string,
    login: string,
    userId: string,
}
type JWTOutput = {
    accessToken: string
}
type AuthLoginFieldsForErrorMessages = 'loginOrEmail' | 'password';
export {AuthLogin, AuthLoginFieldsForErrorMessages, JWTOutput, AuthMeUserInfo};