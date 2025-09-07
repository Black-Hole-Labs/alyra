import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { 
  UserRepository, 
  UserReferralRepository, 
  IUser,
  IUserReferral,
  IReferralStats,
  IReferral,
  TransactionRepository
} from '@black-hole/core-db';
import { CreateReferralDto, JoinReferralDto } from '@black-hole/core-db';

@Injectable()
export class ReferralService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userReferralRepository: UserReferralRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  /**
   * Регистрация нового реферала
   */
  async registerReferral(createReferralDto: CreateReferralDto): Promise<IReferral> {
    const { referrerAddress, chainId } = createReferralDto;

    // Проверяем, не зарегистрирован ли уже этот адрес
    const existingUser = await this.userRepository.findByAddress(
      referrerAddress,
      chainId
    );

    if (existingUser) {
      throw new BadRequestException('Referral already exists for this address and network');
    }

    // Генерируем уникальный реферальный код
    const referralCode = await this.userRepository.generateUniqueCode();

    // Создаем реферала с дефолтным процентом награды
    const user = await this.userRepository.create({
      referralCode,
      address: referrerAddress,
      chainId,
      rewardPercentage: 0.4, // 40% по умолчанию
    });

    // Возвращаем в формате, ожидаемом фронтендом
    return {
      id: user.id,
      referrerCode: user.referralCode,
      referrerAddress: user.address,
      chainId: user.chainId,
      createdAt: user.createdAt,
    };
  }

  /**
   * Регистрация нового адреса с существующим реферальным кодом
   */
  async registerReferralWithCode(referrerCode: string, referrerAddress: string, chainId: number): Promise<IReferral> {
    // Проверяем существование реферального кода
    const existingUsers = await this.userRepository.findAllByCode(referrerCode);
    if (existingUsers.length === 0) {
      throw new NotFoundException('Invalid referral code');
    }

    // Проверяем, не зарегистрирован ли уже этот адрес
    const existingAddressUser = await this.userRepository.findByAddress(
      referrerAddress,
      chainId
    );

    if (existingAddressUser) {
      // Если адрес уже зарегистрирован, возвращаем существующую запись
      return {
        id: existingAddressUser.id,
        referrerCode: existingAddressUser.referralCode,
        referrerAddress: existingAddressUser.address,
        chainId: existingAddressUser.chainId,
        createdAt: existingAddressUser.createdAt,
      };
    }

    // Создаем новую запись с тем же реферальным кодом и дефолтным процентом
    const user = await this.userRepository.create({
      referralCode: referrerCode,
      address: referrerAddress,
      chainId,
      rewardPercentage: 0.4, // 40% по умолчанию
    });

    return {
      id: user.id,
      referrerCode: user.referralCode,
      referrerAddress: user.address,
      chainId: user.chainId,
      createdAt: user.createdAt,
    };
  }

  /**
   * Присоединение пользователя по реферальной ссылке
   */
  async joinReferral(joinReferralDto: JoinReferralDto): Promise<IUserReferral> {
    const { referrerCode, userAddress, userChainId } = joinReferralDto;

    // Проверяем существование реферала
    const users = await this.userRepository.findAllByCode(referrerCode);
    if (users.length === 0) {
      throw new NotFoundException('Invalid referral code');
    }

    // Проверяем, не является ли пользователь самим рефералом в любой из записей
    const isSelfReferral = users.some(
      user => user.address === userAddress && user.chainId === userChainId
    );
    
    if (isSelfReferral) {
      throw new BadRequestException('Cannot refer yourself');
    }

    // Проверяем, не присоединился ли уже пользователь к какому-либо рефералу
    const existingUserReferral = await this.userReferralRepository.findByAddress(
      userAddress,
      userChainId
    );

    if (existingUserReferral) {
      throw new BadRequestException('User already joined a referral program');
    }

    // Используем первую запись для создания связи (можно выбрать случайную или по приоритету)
    const user = users[0];

    // Создаем связь пользователя с рефералом
    const userReferral = await this.userReferralRepository.create({
      userId: user.id,
      userAddress,
      userChainId,
    });

    return userReferral;
  }

  /**
   * Проверка, является ли адрес рефералом
   */
  async isReferral(address: string, chainId: number): Promise<boolean> {
    const user = await this.userRepository.findByAddress(address, chainId);
    return !!user;
  }


  /**
   * Получение информации о реферале по адресу
   */
  async getReferralByAddress(address: string, chainId: number): Promise<IReferral | null> {
    const user = await this.userRepository.findByAddress(address, chainId);
    if (!user) return null;
    
    return {
      id: user.id,
      referrerCode: user.referralCode,
      referrerAddress: user.address,
      chainId: user.chainId,
      createdAt: user.createdAt,
    };
  }

  /**
   * Получение статистики реферала по коду (все сети)
   */
  async getReferralStatsByCode(code: string): Promise<IReferralStats> {
    const users = await this.userRepository.findAllByCode(code);
    if (users.length === 0) {
      throw new NotFoundException('Referral not found');
    }

    // Собираем всех user_referrals для всех записей с этим кодом
    const allUserReferrals = await Promise.all(
      users.map(user => this.userReferralRepository.findUserReferralsByUserId(user.id))
    );
    const userReferrals = allUserReferrals.flat();
    const referralAddresses = userReferrals.map(ur => ur.userAddress);

    // DEBUG: логируем адреса рефералов
    console.log('[getReferralStatsByCode] referralAddresses:', referralAddresses);

    let totalVolume = 0;
    for (const user of users) {
      const txs = await this.transactionRepository.findByAddress(user.address);
      const volumeForAddress = txs.reduce((sum, tx) => sum + Number(tx.amountUSD || 0), 0);
      console.log(`[getReferralStatsByCode] user address: ${user.address}, tx count: ${txs.length}, volume: ${volumeForAddress}`);
      totalVolume += volumeForAddress;
    }

    // Считаем статистику по транзакциям всех рефералов
    let totalVolumeReferred = 0;
    let totalCommissions = 0;
    let pendingCommissions = 0; // если нужна логика pending — добавьте здесь
    
    // Используем процент из БД для первого пользователя (все пользователи с одним кодом имеют одинаковый процент)
    const rewardPercentage = users[0]?.rewardPercentage || 0.4;
    
    for (const address of referralAddresses) {
      const txs = await this.transactionRepository.findByAddress(address);
      const sumForAddress = txs.reduce((sum, tx) => sum + Number(tx.amountUSD), 0);
      const commissionForAddress = sumForAddress * rewardPercentage;
      // DEBUG: логируем по каждому адресу
      console.log(`[getReferralStatsByCode] address: ${address}, tx count: ${txs.length}, sum: ${sumForAddress}, commission: ${commissionForAddress}, reward percentage: ${(rewardPercentage * 100).toFixed(1)}%`);
      totalVolumeReferred += sumForAddress;
      totalCommissions += commissionForAddress;
      // pendingCommissions += ... // если нужно
    }

    // DEBUG: финальные значения
    console.log('[getReferralStatsByCode] totalVolumeReferred:', totalVolumeReferred);
    console.log('[getReferralStatsByCode] totalCommissions:', totalCommissions);

    return {
      id: users[0].id,
      referrerCode: code,
      referrerAddress: users[0].address,
      chainId: users[0].chainId,
      totalVolume,
      totalVolumeReferred,
      totalReferrals: referralAddresses.length,
      totalCommissions,
      pendingCommissions,
      rewardPercentage: rewardPercentage, // Добавляем информацию о проценте награды
    };
  }
} 