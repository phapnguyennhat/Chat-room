import { IsEnum, IsOptional } from "class-validator";
import { QueryPagination } from "src/common/queryPagination";

export enum ELogCollection {
    ISREAD = 'isRead',
    ISUNREAD = 'isUnread',
    ALL = 'all'
}

export class QueryLogDto extends QueryPagination {
    @IsEnum(ELogCollection)
    @IsOptional()
    collection: ELogCollection
    
}