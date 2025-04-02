import { ExecFileException } from "child_process";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { QueryPagination } from "src/common/queryPagination";



export class QueryFriendDto extends QueryPagination{
    @IsString()
    @IsOptional()
    keyword: string


} 