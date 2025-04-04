import { BaseEntity } from "src/common/baseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Log extends BaseEntity {
    @Column()
    message: string
    
    @Column()
    senderId: string

    @ManyToOne(() => User)
    sender: User

    @Column()
    receiverId: string

    @ManyToOne(() => User)
    receiver: User;

    @Column('boolean', { default: false })
    isRead: boolean
}
