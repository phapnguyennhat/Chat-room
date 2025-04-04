import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { QueryPagination } from "src/common/queryPagination";

export enum EFriendRequestCollection {
    REQUESTSENT = 'requests-sent',
    REQUESTRECEIVED = 'requests-received'
}

export class QueryFriendRequestDto extends QueryPagination {


    @IsOptional()
    @IsEnum(EFriendRequestCollection)
    collection :EFriendRequestCollection
}