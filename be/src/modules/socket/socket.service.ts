import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { WsException } from '@nestjs/websockets';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { LogService } from '../log/log.service';
import { FriendService } from '../friend/friend.service';


@Injectable()
export class SocketService {

  constructor(private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logService: LogService,
    private readonly friendService: FriendService,
  ) { }


  async handleConnection(socket: Socket) {
      return this.authService.handleConnection(socket)
  }

  async handleDisconnect(socket: Socket) {
    return this.authService.handleDisconnect(socket)
  }

  getUserBySocket(socket: Socket) {
    return this.authService.getUserBySocket(socket)
  }

 


  
}
