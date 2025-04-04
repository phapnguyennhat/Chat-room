import { ExecFileException } from "child_process";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { QueryPagination } from "src/common/queryPagination";


export enum ECollectionFriend {
    ALL = 'all',
    HASREAD = 'hasRead',
    UNREAD = 'unRead',
}


export class QueryFriendDto extends QueryPagination{
    @IsString()
    @IsOptional()
    keyword: string

   @IsEnum(ECollectionFriend)
   @IsOptional()
   collection: ECollectionFriend



} 