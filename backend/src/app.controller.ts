import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api')
  async getHello(): Promise<{ tools: string[] }> {
    return this.appService.getHello();
  }
  
}
