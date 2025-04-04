import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from 'src/database/entity/log.entity';
import { CreateLogData, CreateLogDto } from './dto/createLog.dto';
import { ELogCollection, QueryLogDto } from './dto/queryLog.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log) private logRepo: Repository<Log>,
  ) { }


  async createLog(createLogDto: CreateLogData) {
    const log = this.logRepo.create(createLogDto);
    return this.logRepo.save(log);
  }

  async getLogs(query: QueryLogDto, receiverId: string) {
    const { page=1, limit=10, collection } = query
    const queryBuilder = this.logRepo.createQueryBuilder('log').innerJoin('log.sender', 'sender')
      .leftJoin('sender.avatar', 'avatar')
      .andWhere('log.receiverId = :receiverId', { receiverId })
      .orderBy('log.createAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

      .select(['log.id','log.createAt','log.message', 'log.isRead','sender.id','sender.name','avatar.url'])
    
    if (collection === ELogCollection.ISREAD) {
      queryBuilder.andWhere('log.isRead = :isRead', { isRead: true })
     }else if (collection === ELogCollection.ISUNREAD) {
      queryBuilder.andWhere('log.isRead = :isRead', { isRead: false })
     }

    const [data, count] = await queryBuilder.getManyAndCount()

    const numPage = Math.ceil(count / query.limit)
    if (query.page + 1 > numPage) {
      return { data, currentPage: query.page, nextPage: null , count}
    }
    return { data, currentPage: query.page, nextPage: Math.min(query.page + 1, numPage), count }
  }
}