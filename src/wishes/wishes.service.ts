import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne({ where: { id } });

    const copiedWish = this.wishesRepository.create({
      copied: 0,
      description: wish.description,
      image: wish.image,
      link: wish.link,
      name: wish.name,
      owner: user,
      price: wish.price,
      raised: 0,
    });

    wish.copied += 1;

    await this.wishesRepository.save(wish);

    return await this.wishesRepository.save(copiedWish);
  }

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });

    const savedWish = await this.wishesRepository.save(wish);

    return this.findOne({ relations: ['owner'], where: { id: savedWish.id } });
  }

  async findAll(options: FindOptionsWhere<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.findBy(options);
  }

  async findOne(options: FindOneOptions<Wish>): Promise<Wish> {
    const wish = await this.wishesRepository.findOne(options);

    if (!wish) {
      throw new NotFoundException();
    }

    return wish;
  }

  async findWishById(id: number): Promise<Wish> {
    return await this.findOne({
      relations: ['owner', 'offers'],
      where: { id },
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { createdAt: 'asc' },
      relations: {
        offers: false,
        owner: true,
      },
      take: 40,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'desc' },
      relations: {
        offers: false,
        owner: true,
      },
      take: 20,
    });
  }

  async removeOne(wish: Wish): Promise<Wish> {
    await this.wishesRepository.remove(wish);

    return wish;
  }

  async removeWishWithChecks(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne({
      relations: ['owner'],
      where: { id },
    });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалить чужой подарок');
    }

    return this.removeOne(wish);
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    await this.wishesRepository.update(id, updateWishDto);

    return await this.findOne({ where: { id } });
  }

  async updateWishWithChecks(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish> {
    const wish = await this.findOne({ where: { id } });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой подарок');
    }

    if (updateWishDto.raised) {
      throw new ForbiddenException(
        'Сумма собранных средств недоступна для изменения',
      );
    }

    if (wish.offers.length > 0 && updateWishDto.price) {
      throw new BadRequestException('Нельзя обновить цену при наличии заявок');
    }

    return await this.updateOne(id, updateWishDto);
  }
}
