import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { FriendModule } from '../friend/friend.module';
import { LogModule } from '../log/log.module';

@Module({
  
  imports: [AuthModule, FriendModule, LogModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
