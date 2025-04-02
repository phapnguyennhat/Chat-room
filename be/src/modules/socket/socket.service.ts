import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  private userSocketMap = new Map<string, string>(); // userId -> socketId

  setSocketId(userId: string, socketId: string) {
    this.userSocketMap.set(userId, socketId);
  }

  getSocketId(userId: string): string | undefined {
    return this.userSocketMap.get(userId);
  }

  removeSocketId(userId: string) {
    this.userSocketMap.delete(userId);
  }
}