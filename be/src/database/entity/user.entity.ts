import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/baseEntity';
import { File } from './file.entity';
import { FriendItem } from './friendItem.entity';
import { FriendRequest } from './friendRequest.entity';

export enum AuthBy {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  FACEBOOK = 'FACEBOOK',
  LOCAL = 'LOCAL',
}

export enum EGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum ERole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IAuthPayload {
  id: string;
  name: string,
  username: string,
  email: string,
  role: ERole,
  avatar: File
  exp?:number
}

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ enum: AuthBy, type: 'enum', default: AuthBy.LOCAL })
  authBy: AuthBy;

  @Column({ enum: ERole, type: 'enum', default: ERole.USER })
  role: ERole;

  @Column({ nullable: true })
  @Exclude()
  code: string;

  @Column({ nullable: true })
  codeExprired: Date;

  @Column({ nullable: true })
  avatarId: string;

  @OneToOne(() => File, { eager: true })
  @JoinColumn()
  avatar: File;

  @OneToMany(() => FriendItem, (friendItem: FriendItem)=>friendItem.user)
  friendItems: FriendItem[]

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  requestSent: FriendRequest[]
  
  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  requestReceived: FriendRequest[]
  
  socketId: string

}
