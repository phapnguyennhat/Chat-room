import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendItem } from 'src/database/entity/friendItem.entity';
import { Repository } from 'typeorm';
import {  QueryFriendDto } from './dto/queryFriend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendItem)
    private readonly friendItemRepo: Repository<FriendItem>,
  ) {}

  async getMyFriend(userId: string, query: QueryFriendDto) {
    const { page, limit, keyword } = query;
    const queryBuilder = this.friendItemRepo
      .createQueryBuilder('friendItem')
      .andWhere('friendItem.userId=:userId', { userId })
      .innerJoin('friendItem.friend', 'friend')
      .skip((page - 1) * limit)
      .take(limit)
      .select(['friendItem.id', 'friend.name', 'friend.id']);

    if (keyword) {
      queryBuilder.andWhere(
        'friend.name ILIKE :keyword OR friend.email ILIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    return queryBuilder.getMany();
    }
    
}
