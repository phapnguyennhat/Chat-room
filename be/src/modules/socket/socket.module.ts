import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { FriendModule } from '../friend/friend.module';

@Module({
  imports: [AuthModule, FriendModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
