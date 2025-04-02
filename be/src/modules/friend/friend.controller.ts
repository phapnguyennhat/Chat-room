import {
  Body,
  Controller,
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

@Controller('')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get('user/friend')
  @UseGuards(JwtAuthGuard)
  async getMyFriend(
    @Req() req: RequestWithUser,
    @Query() query: QueryFriendDto,
  ) {
    const { page = 1, limit = 10, keyword } = query;

    return this.friendService.getMyFriend(req.user.id, {
      page,
      limit,
      keyword,
    });
  }

  @Get('user/friend/request')
  @UseGuards(JwtAuthGuard)


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

  @Post('user/friend/request/:id')
  @UseGuards(JwtAuthGuard)
  async actionFriendRequest(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() { action }: ActionFriendRequestDto,
  ) {
    const friendRequest = await this.friendService.findFriendRequestById(id);
    if (friendRequest.receiverId !== req.user.id) {
      throw new ForbiddenException('Not allow');
    }

    if (action === EActionRequest.ACCEPT) {
      return this.friendService.acceptFriendRequest(id);
    }
    return this.friendService.rejectFriendRequest(id);
  }
}
