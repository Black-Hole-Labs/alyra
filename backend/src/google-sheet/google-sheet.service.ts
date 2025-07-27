import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { AddEmailDto } from './google-sheet.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleSheetService {
  constructor(private configService: ConfigService) {}

  async addEmail(addEmailDto: AddEmailDto) {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

    const privateKey = this.configService.get<string>(
      'GOOGLE_CREDS_PRIVATE_KEY',
    );
    const clientEmail = this.configService.get<string>(
      'GOOGLE_CREDS_CLIENT_EMAIL',
    );

    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: formattedPrivateKey,
      },
      scopes: SCOPES,
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = this.configService.get<string>('SHEETS_ID');
    const values = [[addEmailDto.email]];
    const range = 'emails!A:A';
    const resource = {
      values,
    };
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: resource,
    });
    return `This action adds a new email ${addEmailDto.email}`;
  }
}
