import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateUserDto {
  @IsPositive()
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  credit?: number

  @IsOptional()
  @IsString()
  pref?: string

  @IsOptional()
  @IsString()
  name?:string
}