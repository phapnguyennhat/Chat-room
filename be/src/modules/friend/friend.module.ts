import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendItem } from 'src/database/entity/friendItem.entity';
import { FriendRequest } from 'src/database/entity/friendRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendItem, FriendRequest])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
