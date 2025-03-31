import { Transform } from "class-transformer";
import {  CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as moment from 'moment-timezone';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createAt: Date;
  
  @UpdateDateColumn()
  updateAt: Date;
}
