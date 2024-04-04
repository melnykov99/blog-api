type AuthLogin = {
    loginOrEmail: string,
    password: string
}
type JWTOutput = {
    accessToken: string
}
type AuthLoginFieldsForErrorMessages = 'loginOrEmail' | 'password';
export {AuthLogin, AuthLoginFieldsForErrorMessages, JWTOutput};