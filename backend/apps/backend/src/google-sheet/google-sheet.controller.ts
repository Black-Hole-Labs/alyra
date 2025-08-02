import { Controller, Post, Body } from '@nestjs/common';
import { GoogleSheetService } from './google-sheet.service';
import { AddEmailDto } from './google-sheet.dto';

@Controller('sheets')
export class GoogleSheetController {
  constructor(private readonly googleSheetService: GoogleSheetService) {}

  @Post('email')
  addEmail(@Body() addEmailDto: AddEmailDto) {
    return this.googleSheetService.addEmail(addEmailDto);
  }
}
