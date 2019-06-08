import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";

import Message from "./Message";

@Entity()
class Chat extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @OneToMany(type => Message, message => message.chat)
  messages: Message[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}

export default Chat;
