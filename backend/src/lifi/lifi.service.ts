import { Injectable } from '@nestjs/common';
import axios from 'axios';

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
    const optionalFilter = ['ETH', 137] // Both numeric and mnemonic can be used
    /// chainTypes can be of type SVM and EVM. By default, only EVM tokens will be returned
    const optionalChainTypes = "EVM"
    const result = await axios.get('https://li.quest/v1/tokens',
        {params: {
            chains: optionalFilter.join(','),
            chainTypes: optionalChainTypes 
        }});
    return result.data;
  }
}
