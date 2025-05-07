import { IsOptional, IsUrl, Length } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../shared/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({ length: 1500, nullable: true })
  @IsOptional()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @JoinTable()
  @ManyToMany(() => Wish)
  items: Wish[];

  @Column()
  @Length(1, 250)
  name: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
