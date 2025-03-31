import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { IAuthPayload, User } from 'src/database/entity/user.entity';
import { UserService } from 'src/modules/user/user.service';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      
    });
  }

  async validate(payload: IAuthPayload) {
    
    // const user: User = plainToInstance(
    //   User,
    //   await this.userService.findById(payload.userId),
    // );
    // return user;
    return this.userService.findById(payload.userId)
  }
}
