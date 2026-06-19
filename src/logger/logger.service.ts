import { injectable } from 'inversify';
import type { ILogger } from './logger.interface';
import 'reflect-metadata';
import path from 'node:path';
import { consoleFormat, customFormat } from '@src/logger/logger.util';
import { getDir } from '@src/util/pathUtils';
import winston, { format, type Logger } from 'winston';

const LOG_FILE = 'c2c.log';

const logDir = getDir('');

@injectable()
export class LoggerService implements ILogger {
  public logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        customFormat,
      ),
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
        new winston.transports.File({
          filename: path.join(logDir, LOG_FILE),
          format: customFormat,
        }),
      ],
    });
  }

  info(message: string, ...meta: unknown[]): void {
    this.logger.info(message, ...meta);
  }

  warn(message: string, ...meta: unknown[]): void {
    this.logger.warn(message, ...meta);
  }

  error(message: string, ...meta: unknown[]): void {
    this.logger.error(message, ...meta);
  }
}
