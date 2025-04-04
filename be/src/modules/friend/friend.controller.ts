import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/common/requestWithUser.interface';
import { QueryFriendDto } from './dto/queryFriend.dto';
import { CreateFriendRequestDto } from './dto/createFriendRequest.dto';
import { ActionFriendRequestDto, EActionRequest } from './dto/actionFriendRequest.dto';
import { EFriendRequestCollection, QueryFriendRequestDto } from './dto/queryFriendRequest.dto';

@Controller('')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get('user/friend')
  @UseGuards(JwtAuthGuard)
  async getMyFriend(
    @Req() req: RequestWithUser,
    @Query() query: QueryFriendDto,
  ) { 
  
    return this.friendService.getMyFriend(req.user.id,query);
  }

  @Get('user/friend/request')
  @UseGuards(JwtAuthGuard)
  async getFriendRequest(
    @Req() req: RequestWithUser,
    @Query() query: QueryFriendRequestDto,
  ) {
    
    return this.friendService.getFriendRequest(req.user.id, query)

    
  }

  @Post('user/friend/request')
  @UseGuards(JwtAuthGuard)
  async createFriendRequest(
    @Req() req: RequestWithUser,
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ) {
    return this.friendService.createFriendRequest({
      senderId: req.user.id,
      ...createFriendRequestDto,
    });
  }

  @Post('user/friend/request/:senderId')
  @UseGuards(JwtAuthGuard)
  async actionFriendRequest(
    @Req() req: RequestWithUser,
    @Param('senderId') senderId: string,
    @Body() { action }: ActionFriendRequestDto,
  ) {
    const friendRequest = await this.friendService.findFriendRequestBySenderIdAndReceiverId(senderId,req.user.id)
    if (friendRequest.receiverId !== req.user.id) {
      throw new ForbiddenException('Not allow');
    }

    if (action === EActionRequest.ACCEPT) {
      return this.friendService.acceptFriendRequest(friendRequest.id);
    }
    return this.friendService.rejectFriendRequest(friendRequest.id);
  }

  @Delete('user/friend/:friendId')
  @UseGuards(JwtAuthGuard)
  async removeFriend(
    @Req() req: RequestWithUser,
    @Param('friendId') friendId: string,
  ) {
    await Promise.all([
      this.friendService.removeFriendByUserIdAndFriendId(req.user.id, friendId),
      this.friendService.removeFriendByUserIdAndFriendId(friendId, req.user.id),
    ]);

    return {
      message: 'Remove friend successfully'
    }
  }

  @Delete('user/friend/request/:receiverId')
  @UseGuards(JwtAuthGuard)
  async cancelRequest(@Req() req: RequestWithUser, @Param('receiverId')receiverId: string) {
    const friendRequest = await this.friendService.findFriendRequestBySenderIdAndReceiverId(req.user.id, receiverId)
    if (friendRequest.senderId !== req.user.id) {
      throw new ForbiddenException('Not allow')
    }
    return this.friendService.rejectFriendRequest(friendRequest.id)
  }
}
