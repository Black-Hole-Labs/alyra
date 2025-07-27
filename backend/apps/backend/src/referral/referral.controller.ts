import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { 
  CreateReferralDto, 
  CreateReferralWithCodeDto,
  JoinReferralDto,
  IReferral,
  IUserReferral,
  IReferralStats,
} from '@black-hole/core-db';

@Controller('referral')
@UsePipes(new ValidationPipe({ transform: true }))
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  /**
   * Регистрация нового реферала
   * POST /referral/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerReferral(@Body() createReferralDto: CreateReferralDto): Promise<IReferral> {
    return this.referralService.registerReferral(createReferralDto);
  }

  /**
   * Регистрация нового адреса с существующим реферальным кодом
   * POST /referral/register-with-code
   */
  @Post('register-with-code')
  @HttpCode(HttpStatus.CREATED)
  async registerReferralWithCode(@Body() createReferralWithCodeDto: CreateReferralWithCodeDto): Promise<IReferral> {
    const { referrerCode, referrerAddress, chainId } = createReferralWithCodeDto;
    return this.referralService.registerReferralWithCode(referrerCode, referrerAddress, chainId);
  }

  /**
   * Присоединение пользователя по реферальной ссылке
   * POST /referral/join
   */
  @Post('join')
  @HttpCode(HttpStatus.CREATED)
  async joinReferral(@Body() joinReferralDto: JoinReferralDto): Promise<IUserReferral> {
    return this.referralService.joinReferral(joinReferralDto);
  }

  /**
   * Проверка, является ли адрес рефералом
   * GET /referral/check/:address
   */
  @Get('check/:address')
  async isReferral(
    @Param('address') address: string,
    @Query('chainId') chainId: string
  ): Promise<{ isReferral: boolean }> {
    if (!chainId) {
      throw new Error('ChainId parameter is required');
    }
    const isReferral = await this.referralService.isReferral(address, parseInt(chainId));
    return { isReferral };
  }

  /**
   * Получение информации о реферале по адресу
   * GET /referral/info/:address
   */
  @Get('info/:address')
  async getReferralInfo(
    @Param('address') address: string,
    @Query('chainId') chainId: string
  ): Promise<IReferral | null> {
    if (!chainId) {
      throw new Error('ChainId parameter is required');
    }
    return this.referralService.getReferralByAddress(address, parseInt(chainId));
  }

  /**
   * Получение статистики реферала по коду (все сети)
   * GET /referral/stats-by-code/:code
   */
  @Get('stats-by-code/:code')
  async getReferralStatsByCode(@Param('code') code: string): Promise<IReferralStats> {
    console.log('[ReferralController.getReferralStatsByCode] Received code:', code);
    return this.referralService.getReferralStatsByCode(code);
  }
} 