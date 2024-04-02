type AuthLogin = {
    loginOrEmail: string,
    password: string
}
type AuthLoginFieldsForErrorMessages = 'loginOrEmail' | 'password';
export {AuthLogin, AuthLoginFieldsForErrorMessages};