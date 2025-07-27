import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LifiTenderlyService {
  private readonly API_URL = 'https://li.quest/v1';
  private readonly TENDERLY_PROJECT = 'hello';
  private readonly TENDERLY_ACCESS_KEY = 'g6-ABAY0gq4N0chspNNbB82WWOAAhLha';
  private readonly TENDERLY_USER = 'tiveja2833';
  private readonly TENDERLY_API_URL = `https://api.tenderly.co/api/v1/account/${this.TENDERLY_USER}/project/${this.TENDERLY_PROJECT}/simulate`;

  async getQuote(fromChain: string, toChain: string, fromToken: string, toToken: string, fromAmount: string, fromAddress: string) {
    try {
      const response = await axios.get(`${this.API_URL}/quote`, {
        params: { fromChain, toChain, fromToken, toToken, fromAmount, fromAddress },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch quote',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async simulateTransaction(transactionRequest: any) {
    const payload = {
      network_id: '1',
      from: transactionRequest.from,
      to: transactionRequest.to,
      input: transactionRequest.data,
    //   gas: transactionRequest.gasLimit.toString(),
    //   gas_price: transactionRequest.gasPrice.toString(),
    //   value: transactionRequest.value.toString(),
    };
    
    try {
      const response = await axios.post(this.TENDERLY_API_URL, payload, {
        headers: {
          'X-Access-Key': this.TENDERLY_ACCESS_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to simulate transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async runExample() {
    const fromChain = '1';
    const fromToken = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const toChain = '10';
    const toToken = '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58';
    const fromAmount = '1000000';
    const fromAddress = '0x8c5e11d36c3b42d258eb2ddb493e00a6d041fb69';

    // const provider = new ethers.JsonRpcProvider('https://mainnet.gateway.tenderly.co', 1);
    // const wallet = ethers.Wallet.fromPhrase('test test test test test test test test test test test junk').connect(provider);

    const quote = await this.getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
    const simulationResult = await this.simulateTransaction(quote.transactionRequest);
    

    return { quote, simulationResult };
  }
}
