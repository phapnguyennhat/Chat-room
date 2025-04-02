import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/database/entity/file.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateFileDto } from './dto/createFile.dto';


@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>
  ){}

  async create(createFileDto: CreateFileDto, queryRunner?:QueryRunner){
    if(queryRunner){
      return queryRunner.manager.save(File, createFileDto)
    }
    return this.fileRepo.save(createFileDto)
  }

  async findById(id: string){
    const file = await this.fileRepo.findOneBy({id})
    if(!file){
      throw new NotFoundException('File is not found')
    }
    return file
  }
}
