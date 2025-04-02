import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendItem } from 'src/database/entity/friendItem.entity';
import { DataSource, Repository } from 'typeorm';
import {  QueryFriendDto } from './dto/queryFriend.dto';
import { FriendRequest } from 'src/database/entity/friendRequest.entity';
import { FriendRequestData } from './dto/createFriendRequest.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendItem)
    private readonly friendItemRepo: Repository<FriendItem>,
    @InjectRepository(FriendRequest) private readonly friendRequestRepo: Repository<FriendRequest>,
    private readonly dataSource: DataSource
  ) {}

  async getMyFriend(userId: string, query: QueryFriendDto) {
    const { page, limit, keyword } = query;
    const queryBuilder = this.friendItemRepo
      .createQueryBuilder('friendItem')
      .andWhere('friendItem.userId=:userId', { userId })
      .innerJoin('friendItem.friend', 'friend')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('friend.name', 'ASC')
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
  
  async createFriendRequest(friendRequestData: FriendRequestData) {
    let friendRequest = await this.friendRequestRepo.findOneBy(friendRequestData);

    if (friendRequest) {
        // Cập nhật createdAt = thời gian hiện tại
        friendRequest.createAt = new Date();
    } else {
        // Nếu chưa tồn tại, tạo mới
        friendRequest = this.friendRequestRepo.create(friendRequestData);
    }

    return this.friendRequestRepo.save(friendRequest);
}

  async findFriendRequestById(id: string) {
   
    const friendRequest = await this.friendRequestRepo.findOneBy({ id })
    if (!friendRequest) {
      throw new NotFoundException('Not found friend request')
    }
    return friendRequest
  }

  async acceptFriendRequest(id: string) {
    const queryRunner = this.dataSource.createQueryRunner()
    
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const { senderId, receiverId } = await queryRunner.manager.findOneBy(FriendRequest, { id })
      
      await queryRunner.manager.save(FriendItem, { userId: senderId, friendId: receiverId });
      await queryRunner.manager.save(FriendItem, { userId: receiverId, friendId: senderId });
      await queryRunner.manager.delete(FriendRequest, {id})
      

      await queryRunner.commitTransaction()
      return {message: 'Accept  friend request successfully'}
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
      
    } finally {
      await queryRunner.release()
    }
  }

  
  async rejectFriendRequest(id: string) {
    return this.friendRequestRepo.delete(id)
  }



    
}
