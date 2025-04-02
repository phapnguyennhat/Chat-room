import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SocketService {


    private userSocketMap = new Map<string, string>(); // userId -> socketId
    
    constructor(private readonly authService :AuthService){}

  setSocketId(userId: string, socketId: string) {
    this.userSocketMap.set(userId, socketId);
  }

  getSocketId(userId: string): string | undefined {
    return this.userSocketMap.get(userId);
  }

  removeSocketId(userId: string) {
    this.userSocketMap.delete(userId);
  }

  async getUserBySocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      socket.disconnect();
    }

    const { Authentication: accessToken } = parse(cookie) || {};
    if (!accessToken) {
      socket.disconnect();
    }

    const user = await this.authService.getUserByAccessToken(accessToken);
    if (!user) {
      socket.disconnect();
      }
      

    return user;
  }
}
