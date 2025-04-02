import { BaseEntity } from "src/common/baseEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class File extends BaseEntity{
  @Column()
  key: string

  @Column()
  url :string

  @Column()
  format: string

  @Column()
  name: string
}