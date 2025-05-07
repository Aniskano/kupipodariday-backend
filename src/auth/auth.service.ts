import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<null | User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const hasMatch = await this.hashService.compare(password, user.password);

    if (!hasMatch) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    return user;
  }
}
