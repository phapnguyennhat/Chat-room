import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { CreateFriendRequestDto } from '../friend/dto/createFriendRequest.dto';
import { FriendService } from '../friend/friend.service';
import 'dotenv/config';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from 'src/database/entity/user.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly friendService: FriendService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async handleConnection(socket: Socket) {
    return this.socketService.handleConnection(socket);
  }

  async handleDisconnect(socket: Socket) {
    return this.socketService.handleDisconnect(socket);
  }



  @SubscribeMessage('send_action_user')
  async sendActionUser(@MessageBody() { action, receiverId }: { action: string, receiverId: string }, @ConnectedSocket() socket: Socket) {
    const payload = this.socketService.getUserBySocket(socket);
    if (!payload) {
      return;
    }

    const receiverSocketId: string = await this.cacheManager.get(
      `socket:${receiverId}`,
    );

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_action_user', { action, sender: payload});
    }
  }
}
