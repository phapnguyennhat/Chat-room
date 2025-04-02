import { BaseEntity } from "src/common/baseEntity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendItem extends BaseEntity {
    @Column()
    userId: string

    @ManyToOne(() => User)
    user: User

    @Column()
    friendId: string

    @ManyToOne(() => User)
    friend: User
}