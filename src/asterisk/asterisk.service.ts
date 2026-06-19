import net from 'node:net';
import type { AsteriskRequestBody, IAsteriskService } from '@src/asterisk/asterisk.types';
import { buildAction, generateActionId } from '@src/asterisk/asterisk.util';
import type { IConfigService } from '@src/config/config.interface';
import type { ILogger } from '@src/logger/logger.interface';
import { TYPES } from '@src/types';
import { inject, injectable } from 'inversify';

@injectable()
export class AsteriskService implements IAsteriskService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: ILogger,
    @inject(TYPES.ConfigService) private readonly configService: IConfigService,
  ) {}

  public async processingCommands(data: AsteriskRequestBody): Promise<void> {
    const AMI_HOST = this.configService.get('AMI_HOST');
    const AMI_PORT = Number(this.configService.get('AMI_PORT'));
    const AMI_USER = this.configService.get('AMI_USER');
    const AMI_SECRET = this.configService.get('AMI_SECRET');

    const ORIG: string[] = [
      `ActionID: ${generateActionId()}`,
      `Channel: sip/${data.user}@multifon-84957775172`,
      `CallerID: "${data.user}" <${data.user}>`,
      `Context: from-ami`,
      `Exten: ${data.client}`,
      'Priority: 1',
      'Timeout: 300000',
      'Async: true',
      `Variable: C2C_AGENT=${data.user}`,
      `Variable: C2C_CLIENT=${data.client}`,
      'Archive: yes',
    ];

    const loginBlock = buildAction('Login', [
      `Username: ${AMI_USER}`,
      `Secret: ${AMI_SECRET}`,
      'Events: off',
    ]);

    const originateBlock = buildAction('Originate', ORIG);

    const logoffBlock = buildAction('Logoff', []);

    const payload = loginBlock + originateBlock + logoffBlock;

    // --- Отправка ---
    await new Promise<void>((resolve, reject) => {
      const socket = new net.Socket();
      let responseBuf = '';

      socket.setTimeout(15000, () => {
        this.logger.error('[AsteriskService] AMI timeout');
        socket.destroy();
        reject(new Error('AMI timeout'));
      });

      socket.on('data', (chunk) => {
        responseBuf += chunk.toString('utf8');
        this.logger.info(`[AsteriskService] AMI response chunk:\n${responseBuf}`);
      });

      socket.on('close', () => {
        this.logger.info('[AsteriskService] AMI socket closed');
        resolve();
      });

      socket.on('error', (err) => {
        this.logger.error(`[AsteriskService] AMI error: ${err.message}`);
        reject(err);
      });

      socket.connect(AMI_PORT, AMI_HOST, () => {
        this.logger.info(`[AsteriskService] Connected to AMI ${AMI_HOST}:${AMI_PORT}`);
        this.logger.info(`[AsteriskService] >>>\n${payload}`);
        socket.write(payload, 'utf8', () => {
          setTimeout(() => socket.end(), 300);
        });
      });
    });

    this.logger.info('[AsteriskService] AMI script executed');
  }
}
