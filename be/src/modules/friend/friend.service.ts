import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendItem } from 'src/database/entity/friendItem.entity';
import { DataSource, Repository } from 'typeorm';
import { ECollectionFriend, QueryFriendDto } from './dto/queryFriend.dto';
import { FriendRequest } from 'src/database/entity/friendRequest.entity';
import { FriendRequestData } from './dto/createFriendRequest.dto';
import { EFriendRequestCollection, QueryFriendRequestDto } from './dto/queryFriendRequest.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendItem)
    private readonly friendItemRepo: Repository<FriendItem>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    private readonly dataSource: DataSource,
  ) { }

  async getMyFriend(userId: string, query: QueryFriendDto) {
    const { page = 1, limit = 10, keyword = '', collection } = query;
    const queryBuilder = this.friendItemRepo
      .createQueryBuilder('friendItem')
      .andWhere('friendItem.userId=:userId', { userId })
      .innerJoin('friendItem.friend', 'friend')
      .leftJoin('friend.avatar', 'avatar')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('friend.name', 'ASC')
      .select(['friendItem.id', 'friend.name', 'friend.id', 'avatar.url', 'friend.email']);

    if (keyword) {
      queryBuilder.andWhere(
        'friend.name ILIKE :keyword OR friend.email ILIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    if (collection === ECollectionFriend.HASREAD) {
      queryBuilder.andWhere('friendItem.hasRead=:hasRead', { hasRead: true })
    }
    else if (collection === ECollectionFriend.UNREAD) {
      queryBuilder.andWhere('friendItem.hasRead=:hasRead', { hasRead: false })
    }

    const [data, count] = await queryBuilder.getManyAndCount();
    const numPage = Math.ceil(count / limit);
    if (page + 1 > numPage) {
      return { data, currentPage: page, nextPage: null, count }
    }
    return { data, currentPage: page, nextPage: page + 1, count }
  }

  async createFriendRequest(friendRequestData: FriendRequestData) {
    let friendRequest =
      await this.friendRequestRepo.findOneBy(friendRequestData);

    const friendRequestReverse = await this.findFriendRequestBySenderIdAndReceiverId(friendRequestData.receiverId, friendRequestData.senderId)
    if (friendRequestReverse) {
      throw new BadRequestException('This user has sent you a friend request')
    }

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
    const friendRequest = await this.friendRequestRepo.findOneBy({ id });
    if (!friendRequest) {
      throw new NotFoundException('Not found friend request');
    }
    return friendRequest;
  }

  async findFriendRequestBySenderIdAndReceiverId(senderId: string, receiverId: string) {
    return this.friendRequestRepo.findOneBy({ senderId, receiverId })
  }

  async acceptFriendRequest(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { senderId, receiverId } = await queryRunner.manager.findOneBy(
        FriendRequest,
        { id },
      );

      await queryRunner.manager.save(FriendItem, {
        userId: senderId,
        friendId: receiverId,
        
      });
      await queryRunner.manager.save(FriendItem, {
        userId: receiverId,
        friendId: senderId,
        hasRead: true,
      });
      await queryRunner.manager.delete(FriendRequest, { id });

      await queryRunner.commitTransaction();
      return { message: 'Accept  friend request successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectFriendRequest(id: string) {
    return this.friendRequestRepo.delete(id);
  }

  async deleteRequestBySenderAndReceiver(senderId: string, receiverId: string) {
    return this.friendRequestRepo.delete({ senderId, receiverId })
  }




  async getFriendRequest(userId: string, query: QueryFriendRequestDto) {
    const { page = 1, limit = 10, collection } = query

    const queryBuilder = this.friendRequestRepo.createQueryBuilder('friendRequest').orderBy('friendRequest.createAt', 'DESC').skip((page-1)*limit).take(limit)
    
    if (collection === EFriendRequestCollection.REQUESTRECEIVED) { 
      queryBuilder.innerJoin('friendRequest.sender', 'sender')
      .leftJoin('sender.avatar', 'avatar')
      .andWhere('friendRequest.receiverId=:userId', {userId})
      .select(['friendRequest.id', 'sender.id', 'sender.name', 'avatar.url', 'friendRequest.createAt'])

    }else if (collection === EFriendRequestCollection.REQUESTSENT){
      queryBuilder.innerJoin('friendRequest.receiver', 'receiver')
      .leftJoin('receiver.avatar', 'avatar')
      .andWhere('friendRequest.senderId=:userId', {userId})
      .select(['friendRequest.id', 'receiver.id', 'receiver.name', 'avatar.url', 'friendRequest.createAt'])
    }

    const [data, count] = await queryBuilder.getManyAndCount()
    const numPage = Math.ceil(count/limit)
    if(page+1 > numPage){
      return {data, currentPage: page, nextPage: null, count}
    }
    return {data, currentPage: page, nextPage: page+1, count}

  }

  async removeFriendByUserIdAndFriendId(userId: string, friendId: string) {
    return this.friendItemRepo.delete({ userId, friendId })
  }


}
