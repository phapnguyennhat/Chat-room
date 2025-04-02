import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/common/queryPagination';

export class QueryUserDto extends QueryPagination {
  @IsString()
  @IsOptional()
  keyword: string;
}
