# Black Hole Monorepo

A monorepo for the Black Hole project containing multiple applications and shared libraries.

## Project Structure

```
black-hole-monorepo/
├── apps/
│   ├── backend/                    # Основное API + реферальная система
│   │   ├── src/
│   │   │   ├── referral/          # Реферальный модуль
│   │   │   │   ├── referral.controller.ts
│   │   │   │   ├── referral.service.ts
│   │   │   │   ├── referral.module.ts
│   │   │   │   ├── dto/
│   │   │   │   └── interfaces/
│   │   │   ├── lifi/              # Существующие модули
│   │   │   ├── lifi-tenderly/
│   │   │   ├── google-sheet/
│   │   │   └── ...
│   │   └── ...
│   ├── observer/                   # Мониторинг транзакций
│   │   ├── src/
│   │   │   ├── transaction-monitor/
│   │   │   │   ├── transaction-monitor.service.ts
│   │   │   │   ├── blockchain-scanner.service.ts
│   │   │   │   └── transaction-processor.service.ts
│   │   │   └── ...
│   │   └── ...
│   └── core-db/                    # Core база данных
│       ├── src/
│       │   ├── entities/           # Все entities
│       │   │   ├── referral.entity.ts
│       │   │   ├── user-referral.entity.ts
│       │   │   ├── referral-transaction.entity.ts
│       │   │   └── referral-commission.entity.ts
│       │   ├── repositories/       # Все repositories
│       │   │   ├── referral.repository.ts
│       │   │   ├── user-referral.repository.ts
│       │   │   └── referral-transaction.repository.ts
│       │   ├── interfaces/         # Общие интерфейсы
│       │   │   ├── referral.interface.ts
│       │   │   ├── user-referral.interface.ts
│       │   │   └── transaction.interface.ts
│       │   ├── dto/               # Общие DTO
│       │   │   ├── referral.dto.ts
│       │   │   ├── user-referral.dto.ts
│       │   │   └── transaction.dto.ts
│       │   ├── database.module.ts # TypeORM модуль
│       │   ├── core-db.module.ts  # Основной модуль
│       │   └── index.ts           # Экспорт всего
│       ├── package.json
│       └── tsconfig.json
├── libs/
│   ├── config/                    # Общая конфигурация
│   │   ├── src/
│   │   │   ├── config.ts
│   │   │   ├── referral.config.ts
│   │   │   └── database.config.ts
│   │   └── ...
│   └── blockchain/                # Интеграция с блокчейнами
│       ├── src/
│       │   ├── evm-scanner.service.ts
│       │   ├── solana-scanner.service.ts
│       │   └── blockchain.module.ts
├── package.json          # Root package.json
└── nest-cli.json         # NestJS CLI configuration
```

## Applications

### Backend (apps/backend)
Main backend application with modules:
- LifiModule - LiFi integration
- LifiTenderlyModule - LiFi Tenderly integration
- GoogleSheetModule - Google Sheets integration

### Observer (apps/observer)
Application for system monitoring and observation.

## Libraries

### Config (libs/config)
Shared configuration library used by all applications.

## Commands

### Install Dependencies
```bash
npm install
```

### Build
```bash
# Build all applications
npm run build

# Build specific application
npm run build:backend
npm run build:observer
npm run build:config
```

### Development Mode
```bash
# Backend
npm run start:backend:dev

# Observer
npm run start:observer:dev
```

### Production Mode
```bash
# Backend
npm run start:backend

# Observer
npm run start:observer
```

### Linting and Formatting
```bash
npm run lint
npm run format
```

### Testing
```bash
npm run test
npm run test:watch
npm run test:cov
node test-referral-api.js
```

## Ports

- Backend: 3000
- Observer: 3001

## Development

To add a new application:
```bash
nest generate app <app-name>
```

To add a new library:
```bash
nest generate library <lib-name>
```

## Configuration

All applications use shared configuration from `libs/config`. Environment variables should be defined in `.env` file in the project root.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

npm run migration:generate -- apps/core-db/src/migrations/UpdateChainIdToBigInt