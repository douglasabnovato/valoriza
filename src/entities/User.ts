/*
 * User.ts · colaborador; a senha é sempre armazenada como hash bcrypt e nunca sai nas respostas.
 */
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("users")
class User {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  admin: boolean;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /* Gera o UUID na criação da instância. */
  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { User };
/* fim de User.ts */
