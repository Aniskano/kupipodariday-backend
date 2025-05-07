import {
  Body,
  Controller,
  Delete,
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
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

@Controller('wishes')
@UseInterceptors(SensitiveDataInterceptor)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wish> {
    return await this.wishesService.copyWish(id, req.user);
  }

  @Post('/')
  @UseGuards(JwtGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(createWishDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wish> {
    return await this.wishesService.removeWishWithChecks(id, req.user);
  }

  @Get('/last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  @Get('/top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findWishById(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.updateWishWithChecks(
      id,
      updateWishDto,
      req.user,
    );
  }
}
