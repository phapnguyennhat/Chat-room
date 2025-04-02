import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/common/requestWithUser.interface';
import { QueryFriendDto } from './dto/queryFriend.dto';

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
}
