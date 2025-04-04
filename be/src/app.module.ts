import { ClassSerializerInterceptor, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from 'env';
import { UserModule } from './modules/user/user.module';
import LogsMiddleware from './util/log.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './util/all-exception.filter';
import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { CACHE_TTL } from './common/constant';
import { GoogleAuthModule } from './modules/google-auth/google-auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { FileModule } from './modules/file/file.module';
import { FriendModule } from './modules/friend/friend.module';
import { SocketModule } from './modules/socket/socket.module';
import { LogModule } from './modules/log/log.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    GoogleAuthModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        stores: [
          createKeyv(configService.get('REDIS_URL')),
        ],
        ttl: CACHE_TTL
      }),
      
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
    }),
    CloudinaryModule,
    FileModule,
    FriendModule,
    SocketModule,
    LogModule,
   
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
   
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
