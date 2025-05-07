import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from 'pg';
import { FindOneOptions, ILike, QueryFailedError, Repository } from 'typeorm';

import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;

    try {
      const hashedPassword = await this.hashService.hash(password);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const pgError = error.driverError as DatabaseError;
        if (pgError.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или ником уже существует',
          );
        }
      }
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    return await this.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.findOne({
      where: { username: ILike(`%${username}%`) },
    });
  }

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ email: query }, { username: ILike(`%${query}%`) }],
    });
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findWishes(query: { id?: number; username?: string }): Promise<Wish[]> {
    const user = await this.findOne({
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
      where: query,
    });

    return user.wishes || [];
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hash(
        updateUserDto.password,
      );
    }

    await this.usersRepository.update(id, updateUserDto);

    return await this.findById(id);
  }
}
