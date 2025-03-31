import { Injectable } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/database/entity/user.entity';

@Injectable()
export class GoogleAuthService {
  oauthClient : OAuth2Client
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ){
    const clientId = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client({
      clientId,
      clientSecret,
    });
  }

  async authenticate(token: string){
    const userData = await this.getUserData(token)
    const user = await this.userService.findByEmail(userData.email)
    if(user){
      return this.getCookiesForUser(user)
    }
    return this.registerUser(userData)

  }

  async getUserData(token: string){
    const ticket = await this.oauthClient.verifyIdToken({idToken: token, audience: this.configService.get('GOOGLE_AUTH_CLIENT_ID')})
    const payload = ticket.getPayload()
    return payload
  }


  async getCookiesForUser (user:User){
    const accessTokenCookie = await this.authService.getCookieWithJwtAccessToken(user.id)
    const refreshTokenCookie = await this.authService.getCookieWithJwtRefreshToken(user.id)
    return {accessTokenCookie, refreshTokenCookie}
  }

  async registerUser (userData: TokenPayload){
    const user: User = await this.userService.createWithGoogle(userData)
    return this.getCookiesForUser(user)
  }
}
