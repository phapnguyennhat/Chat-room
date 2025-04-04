import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum EMessageType {
    FRIEND_REQUEST = 'friendRequest',
    FRIEND_ACCEPT = 'friendAccept',
}

export class CreateLogDto {
    @IsNotEmpty()
    @IsEnum(EMessageType)
    type: EMessageType

    @IsNotEmpty()
    @IsString()
    receiverId: string
}

export class CreateLogData  {
    senderId: string
    receiverId: string
    message: string
    
}
