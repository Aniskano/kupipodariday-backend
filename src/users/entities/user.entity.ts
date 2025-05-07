import { IsEmail, IsUrl, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';
import { BaseEntity } from '../../shared/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { defaultUserSetting } from '../constants/user';

@Entity()
export class User extends BaseEntity {
  @Column({ default: defaultUserSetting.about })
  @Length(2, 200)
  about: string;

  @Column({ default: defaultUserSetting.avatar })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @Column()
  password: string;

  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
