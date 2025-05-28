import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ethers } from 'ethers';

@Injectable()
export class LifiService {

  async getChains() {
    /// chainTypes can be of type SVM and EVM, by default, only EVM chains will be returned
    const optionalChainTypes = "EVM"
    const result = await axios.get('https://li.quest/v1/chains', 
      {params: {chainTypes: optionalChainTypes}});
    return result.data;
  }

  async getTools() {
    const result = await axios.get('https://li.quest/v1/tools');
    return result.data;
  }

  async getTokens() {
    //const optionalFilter = ['ETH', 137] // Both numeric and mnemonic can be used
    /// chainTypes can be of type SVM and EVM. By default, only EVM tokens will be returned
    const optionalChainTypes = "EVM"
    const result = await axios.get('https://li.quest/v1/tokens',
        {params: {
            //chains: optionalFilter.join(','),
            chainTypes: optionalChainTypes 
        }});
    return result.data;
  }

  async getQuote(
    fromChain: string,
    toChain: string,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress: string,
    toAddress?: string,
    slippage?: number
  ) {
    try {
      const params: any = {
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAmount,
        fromAddress,
        integrator: 'blackhole',
      };
  
      if (toAddress) {
        params.toAddress = toAddress;
      }

      if (slippage) {
        params.slippage = slippage;
      }

      const result = await axios.get('https://li.quest/v1/quote', { params });
      return result.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || 'An error occurred';
  
        console.error('Error from external API:', {
          statusCode,
          errorMessage,
        });
  
        throw new HttpException({ statusCode, message: errorMessage }, statusCode);
      }
  
      console.error('Unexpected error:', error);
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

  async getQuoteByReceivingAmount (fromChain: string, toChain: string, fromToken: string, toToken: string, toAmount: string, fromAddress: string) {
    const result = await axios.get('https://li.quest/v1/quote/toAmount', {
        params: {
            fromChain,
            toChain,
            fromToken,
            toToken, // The recipient might receive slightly more toToken than requested due to slippage or rounding
            toAmount,
            fromAddress,
        }
    });
    return result.data;
  }

  async getStatus(txHash: string) {
    const result = await axios.get('https://li.quest/v1/status', {
        params: {
            txHash,
        }
    });
    return result.data;
  }

  async executeTransaction(req, res) {
      const { signedTx } = req.body;

      if (!signedTx) {
          return res.status(400).json({ error: 'Signed transaction is required' });
      }

      const provider = new ethers.JsonRpcProvider('https://rpc.xdaichain.com/', 100); // TODO: choose coorect RPC

      try {
          const txResponse = await provider.broadcastTransaction(signedTx); // Note: new function broadcast instead of send

          const receipt = await txResponse.wait();

          res.json({ status: 'success', receipt }); // TODO: add check getStatus()
      } catch (error) {
          console.error('Error executing transaction:', error);
          res.status(500).json({ status: 'error', error: error.message });
      }
  };
}
