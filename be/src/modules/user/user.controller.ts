import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import RequestWithUser from 'src/common/requestWithUser.interface';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { QueryPagination } from 'src/common/queryPagination';
import { QueryUserDto } from './dto/queryUser.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUser(@Req() req: RequestWithUser, @Query() query: QueryUserDto) {
    const { page = 1, limit = 10, keyword } = query;

    const response = this.userService.findUser(req.user.id, { page, limit, keyword });
    return response
  }
}
