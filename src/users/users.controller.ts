import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { SensitiveDataInterceptor } from '../shared/interceptors/sensitive-data-interceptor';
import { RequestWithUser } from '../shared/types';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @UseInterceptors(SensitiveDataInterceptor)
  async editCurrentUser(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Post('find')
  @UseInterceptors(SensitiveDataInterceptor)
  async findAll(@Body() { query }: FindUsersDto): Promise<User[]> {
    return await this.usersService.findMany(query);
  }

  @Get(':username')
  @UseInterceptors(SensitiveDataInterceptor)
  async getByUsername(@Param('username') username: string): Promise<User> {
    return await this.usersService.findByUsername(username);
  }

  @Get('me')
  @UseInterceptors(SensitiveDataInterceptor)
  async getCurrentUser(@Req() req: RequestWithUser) {
    return await this.usersService.findById(req.user.id);
  }

  @Get('me/wishes')
  @UseInterceptors(SensitiveDataInterceptor)
  async getProfileWishes(@Req() req: RequestWithUser) {
    return await this.usersService.findWishes({ id: req.user.id });
  }

  @Get(':username/wishes')
  @UseInterceptors(SensitiveDataInterceptor)
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    return await this.usersService.findWishes({ username });
  }
}
