import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  itemsId: string[];

  @IsNotEmpty()
  @IsString()
  name: string;
}
