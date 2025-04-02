import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendService } from './friend.service';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { CreateFriendRequestDto } from './dto/createFriendRequest.dto';
import { SocketService } from '../socket/socket.service';
import { UseFilters } from '@nestjs/common';
import { WebsocketExceptionsFilter } from 'src/util/Ws-exception.filter';

@WebSocketGateway()
@UseFilters(WebsocketExceptionsFilter)
export class FriendGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly friendService: FriendService,
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
  ) {}

  async handleConnection(socket: Socket) {
    const user = await this.getUserBySocket(socket);
    console.log(`✅ user ${user.name} connect to friend gateway`);
    this.socketService.setSocketId(user.id, socket.id);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.getUserBySocket(socket);
    console.log(`❌ User ${user.name} disconnected`);
    this.socketService.removeSocketId(user.id);
  }

  @SubscribeMessage('send_friend_request')
  async sendFriendRequest(
    @MessageBody() createFriendRequestDto: CreateFriendRequestDto,
    @ConnectedSocket() socket: Socket,
  ) {
      const {receiverId} = createFriendRequestDto
      const user = await this.getUserBySocket(socket)
      await this.friendService.createFriendRequest({
        senderId: user.id,
        receiverId: receiverId,
      });

      const receiverSocketId = this.socketService.getSocketId(receiverId)
      if (receiverSocketId) {
          this.server.to(receiverSocketId).emit('receive_friend_request',{id: user.id, name: user.name,avatar: user.avatar})
      }else {
        console.log(`⚠️ User ${createFriendRequestDto.receiverId} is offline.`);
      }
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