import { type DotenvConfigOutput, type DotenvParseOutput, config as dotenvConfig } from 'dotenv';
import { inject, injectable } from 'inversify';
import type { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import type { IConfigService } from './config.interface';

@injectable()
export class ConfigService implements IConfigService {
  private readonly config!: DotenvParseOutput;

  constructor(@inject(TYPES.Logger) private logger: ILogger) {
    const result: DotenvConfigOutput = dotenvConfig();

    if (result.error || !result.parsed) {
      this.logger.error('[ConfigService] Не удалось прочитать файл .env или он отсутствует');
      throw result.error ?? new Error('Dotenv parsing error');
    }

    this.logger.info('[ConfigService] Конфигурация .env загружена');
    this.config = result.parsed;
  }

  public get(key: string): string {
    const value = this.config[key];
    if (value === undefined) {
      this.logger.error(`[ConfigService] Отсутствует ключ "${key}" в конфигурации`);
    }
    return value;
  }
}
