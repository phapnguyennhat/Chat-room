import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { IAuthPayload, User } from 'src/database/entity/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Socket } from 'socket.io';
import { parse } from 'cookie';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async validateUser(account: string, password: string) {
    let user: User = null;
    if (isEmail(account)) {
      user = await this.userService.findByEmail(account);
    } else {
      user = await this.userService.findByUsername(account);
    }
    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return null;
    }
    return user;
  }

  async getCookieWithJwtAccessToken(userId: string) {
    const user: User = await this.userService.findById(userId);
    const payload: IAuthPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return {
      token,
      accessTime: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      cookie,
    };
  }

  async getCookieWithJwtRefreshToken(userId: string) {
    const user: User = await this.userService.findById(userId);
    const payload: IAuthPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      accessTime: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      token,
    };
  }

  getUserBySocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie || '';
    const { Refresh: refreshToken } = parse(cookie);
    const payload: IAuthPayload = this.jwtService.decode(refreshToken);

    if (!payload) {
      socket.disconnect();
      return;
    }
    if (!payload.id) {
      socket.disconnect();
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;

    if (ttl <= 0) {
      socket.disconnect();
      return;
    }
    return payload;
  }

  async handleConnection(socket: Socket) {
    const cookie = socket.handshake.headers.cookie || '';
    const { Refresh: refreshToken } = parse(cookie);
    const payload: IAuthPayload = this.jwtService.decode(refreshToken);

    if (!payload) {
      socket.disconnect();
      return;
    }
    if (!payload.id) {
      socket.disconnect();
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;

    if (ttl <= 0) {
      socket.disconnect();
      return;
    }
    console.log(`✅ User ${payload.name} connect to server`);
    await this.cacheManager.set(`socket:${payload.id}`, socket.id, ttl*1000);
  }

  async handleDisconnect(socket: Socket) {
    const payload = this.getUserBySocket(socket);
    console.log(`❌ User ${payload.name} disconnect server`);
    await this.cacheManager.del(`socket:${payload.id}`);
  }
}
