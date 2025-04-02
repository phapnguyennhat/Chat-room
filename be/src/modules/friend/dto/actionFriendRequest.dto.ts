import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export enum EActionRequest {
    REJECT = 'reject',
    ACCEPT = 'accept'
}

export class ActionFriendRequestDto {
  

    @IsNotEmpty()
    @IsEnum(EActionRequest)
    action: EActionRequest

}