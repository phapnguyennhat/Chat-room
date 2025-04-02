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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    // methods: ['GET', 'POST'],
    // allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly friendService: FriendService,
  ) {}

  async handleConnection(socket: Socket) {
    const user = await this.socketService.getUserBySocket(socket);
    console.log(`✅ user ${user.name} connect to server`);
    this.socketService.setSocketId(user.id, socket.id);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.socketService.getUserBySocket(socket);
    console.log(`❌ User ${user.name} disconnected`);
    this.socketService.removeSocketId(user.id);
  }

  @SubscribeMessage('send_friend_request')
  async sendFriendRequest(
    @MessageBody() createFriendRequestDto: CreateFriendRequestDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { receiverId } = createFriendRequestDto;
    const user = await this.socketService.getUserBySocket(socket);
    await this.friendService.createFriendRequest({
      senderId: user.id,
      receiverId: receiverId,
    });

    const receiverSocketId = this.socketService.getSocketId(receiverId);
    if (receiverSocketId) {
      this.server
        .to(receiverSocketId)
        .emit('receive_friend_request', {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        });
    } else {
      console.log(`⚠️ User ${createFriendRequestDto.receiverId} is offline.`);
    }
  }
}
