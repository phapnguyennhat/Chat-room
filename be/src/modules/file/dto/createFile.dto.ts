import { IsNotEmpty, IsString } from "class-validator";

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  key: string

  @IsNotEmpty()
  @IsString()
  url: string

  @IsNotEmpty()
  @IsString()
  format: string

  @IsNotEmpty()
  @IsString()
  name: string
}