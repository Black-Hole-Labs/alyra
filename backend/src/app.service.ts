import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
      const result = await axios.get('https://li.quest/v1/tokens?chains=BTC');
      return result.data;
  }
}
