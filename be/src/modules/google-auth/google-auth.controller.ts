import { Body, Controller, Post, Req } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { IdTokenDto } from './dto/IdToken.dto';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}
  
  @Post()
  async authenticate (@Body() {idToken}: IdTokenDto, @Req() req){
    const {accessTokenCookie, refreshTokenCookie} = await this.googleAuthService.authenticate(idToken)
    req.res.setHeader('Set-Cookie', [accessTokenCookie.cookie, refreshTokenCookie.cookie]);
    return  {accessTokenCookie, refreshTokenCookie}
  }
}
