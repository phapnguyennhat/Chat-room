import { BaseEntity } from "src/common/baseEntity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendRequest extends BaseEntity  {
    @Column()
    senderId: string

    @ManyToOne(() => User)
    sender: User

    @Column()
    receiverId: string

    @ManyToOne(() => User)
    receiver: User

}