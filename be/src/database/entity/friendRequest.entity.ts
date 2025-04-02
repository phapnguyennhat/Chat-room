import { BaseEntity } from "src/common/baseEntity";
import { Check, Column, Entity, ManyToOne, Unique } from "typeorm";
import { User } from "./user.entity";

@Entity()
@Unique(['senderId', 'receiverId'])
@Check(`"senderId" != "receiverId"`)
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