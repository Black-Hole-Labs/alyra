import { Controller, Get } from '@nestjs/common';
import { LifiService } from './lifi.service';

@Controller('lifi')
export class LifiController {
  constructor(private readonly lifiService: LifiService) {}
}
