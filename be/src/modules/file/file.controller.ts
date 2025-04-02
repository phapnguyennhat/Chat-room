import { BadRequestException, Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/createFile.dto';
import { DataSource } from 'typeorm';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File){
    if(!file){
      throw new BadRequestException('File is required')
    }
    
    const {key, url}= await this.cloudinaryService.uploadFile(file, 'CookMate')
    const createFileDto: CreateFileDto = {key, url, format: file.mimetype, name: file.originalname}
    return this.fileService.create(createFileDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string){
    const file = await this.fileService.findById(id)
    return this.cloudinaryService.deleteFile(file.key)
  }
}
