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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
@UseInterceptors(SensitiveDataInterceptor)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post('/')
  async create(
    @Req() req: RequestWithUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Delete(':id')
  async deleteWishlistById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.removeOne(id, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findById(id);
  }

  @Get('/')
  async getAllWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll();
  }

  @Patch(':id')
  async updateWishlistById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateOne(
      id,
      updateWishlistDto,
      req.user,
    );
  }
}
