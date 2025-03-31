import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async test() {
    const cachedData = await this.cacheManager.get('test')
    if (cachedData) {
      return cachedData
    }
    await this.cacheManager.set('test', 'hihi')
    return {message: 'hih'}
  }

}
