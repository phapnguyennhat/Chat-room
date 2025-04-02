import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class QueryPagination {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    page: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    limit: number
}