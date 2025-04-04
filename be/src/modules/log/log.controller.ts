import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto, EMessageType } from './dto/createLog.dto';
import { QueryPagination } from 'src/common/queryPagination';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/common/requestWithUser.interface';
import { QueryLogDto } from './dto/queryLog.dto';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  createLog(@Body() createLogDto: CreateLogDto, @Req() req: RequestWithUser) {
    let message = ''
    if (createLogDto.type === EMessageType.FRIEND_REQUEST) { 
      message = 'has sent you a friend request'
    }else if (createLogDto.type === EMessageType.FRIEND_ACCEPT) {
      message = 'has accepted your friend request'
    }
    return this.logService.createLog({ ...createLogDto, senderId: req.user.id, message });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getLogs(@Query() query: QueryLogDto, @Req() req: RequestWithUser) {
    return this.logService.getLogs(query, req.user.id);
  }
}
