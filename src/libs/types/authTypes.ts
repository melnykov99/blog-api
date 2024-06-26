type AuthEmailResending = {
    email: string
}
type AuthRegistrationConfirmation = {
    code: string
}
type AuthLogin = {
    loginOrEmail: string,
    password: string
}
type AuthMeUserInfo = {
    email: string,
    login: string,
    userId: string,
}
type AccessAndRefreshToken = {
    accessToken: string,
    refreshToken: string,
}
type AccessTokenOutput = {
    accessToken: string,
}
type AuthLoginFieldsForErrorMessages = "loginOrEmail" | "password";
type AuthRegistrationFieldsForErrorMessages = "login" | "email" | "password";
type AuthRegistrationConfirmationFieldsForErrorMessages = "code";
type AuthRegistrationEmailResendingFieldsForErrorMessages = "email";
export {
    AuthLogin,
    AuthLoginFieldsForErrorMessages,
    AuthMeUserInfo,
    AuthEmailResending,
    AuthRegistrationConfirmation,
    AuthRegistrationFieldsForErrorMessages,
    AuthRegistrationConfirmationFieldsForErrorMessages,
    AuthRegistrationEmailResendingFieldsForErrorMessages,
    AccessAndRefreshToken,
    AccessTokenOutput,
};