export { };

declare global{
    interface Token {
        token: string,
        accessTime: number;
        cookie: string
      }

      interface LoginToken {
        accessTokenCookie: Token
        refreshTokenCookie: Token
      }
}