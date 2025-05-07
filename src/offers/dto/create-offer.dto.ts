import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsBoolean()
  @IsNotEmpty()
  hidden: boolean;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
