import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { SensitiveDataInterceptor } from '../shared/interceptors/sensitive-data-interceptor';
import { RequestWithUser } from '../shared/types';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@Controller('offers')
@UseGuards(JwtGuard)
@UseInterceptors(SensitiveDataInterceptor)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('/')
  async create(
    @Req() req: RequestWithUser,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.create(createOfferDto, req.user.id);
  }

  @Get('/')
  async getAllOffers(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  async getOfferById(@Param('id') id: number) {
    return this.offersService.findOfferById(id);
  }
}
