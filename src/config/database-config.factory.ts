import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      autoLoadEntities: this.configService.get<boolean>('db.autoloadEntities'),
      database: this.configService.get<string>('db.name'),
      host: this.configService.get<string>('db.host'),
      password: this.configService.get<string>('db.password'),
      port: this.configService.get<number>('db.port'),
      synchronize: this.configService.get<boolean>('db.synchronize'),
      type: 'postgres',
      username: this.configService.get<string>('db.username'),
    };
  }
}
