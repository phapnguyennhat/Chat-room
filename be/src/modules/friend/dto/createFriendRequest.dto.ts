import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateFriendRequestDto {
    @IsNotEmpty()
    @IsUUID()
    receiverId: string
    
}

export class FriendRequestData extends CreateFriendRequestDto {
    senderId: string
}