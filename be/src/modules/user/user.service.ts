import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthBy, User } from 'src/database/entity/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { TokenPayload } from 'google-auth-library';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { QueryUserDto } from './dto/queryUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findById(id: string) {
    return this.cacheManager.wrap(`user-detail:${id}`, () =>
      this.userRepo.findOneBy({ id }),
    );
  }

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      return queryRunner.manager.update(User, userId, updateUserDto);
    }
    return this.userRepo.update(userId, updateUserDto);
  }

  async create(createUserDto: CreateUserDto) {
    let user = await this.userRepo.findOneBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('Email has been used already!');
    }

    user = await this.userRepo.findOneBy({ username: createUserDto.username });
    if (user) {
      throw new BadRequestException('Username has been used already!');
    }

    return this.userRepo.save(createUserDto);
  }

  async createWithGoogle(userData: TokenPayload) {
    return this.userRepo.save({
      email: userData.email,
      name: userData.name,
      authBy: AuthBy.GOOGLE,
    });
  }

  async findUser(userId: string, query: QueryUserDto) {
    const { page, limit, keyword } = query;

    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .leftJoin(
        'user.friendItems',
        'friendItems',
        'friendItems.friendId =:userId',
        { userId },
      ).leftJoin('user.avatar', 'avatar')
      .andWhere('user.id !=:userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.name', 'ASC')

      .select(['user.id', 'user.name', 'user.email','friendItems.id', 'avatar.url']);
    
      if (keyword) {
        queryBuilder.andWhere(
          'user.name ILIKE :keyword OR user.email ILIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        );
      }

    const [users, count] = await queryBuilder.getManyAndCount()
    return {users, count}
  }
}
