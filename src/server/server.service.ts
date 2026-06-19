import type { IConfigService } from '@src/config/config.interface';
import type { ILogger } from '@src/logger/logger.interface';
import routes from '@src/server/routes/routes';
import { TYPES } from '@src/types';
import Fastify, {
  type FastifyError,
  type FastifyInstance,
  type FastifyPluginAsync,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';
import { inject, injectable } from 'inversify';

@injectable()
export class Server {
  private readonly server: FastifyInstance;
  private readonly host: string;
  private readonly port: number;

  constructor(
    @inject(TYPES.Logger) private readonly logger: ILogger,
    @inject(TYPES.ConfigService) private readonly configService: IConfigService,
  ) {
    this.server = Fastify({
      logger: false,
    });
    this.registerErrorHandler();
    this.register();
    this.host = this.configService.get('HOST');
    this.port = Number(this.configService.get('PORT'));
  }

  private async register(): Promise<void> {
    this.server.addHook(
      'preValidation',
      async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
        const isDebug = this.configService.get('IS_DEBUG') === 'true';
        if (isDebug) {
          const { method, url, params, query, body } = request;
          this.logger.info(`[ServerService] Incoming request: ${method} ${url}`, {
            params,
            query,
            body,
          });
        }
      },
    );

    process.on('SIGINT', async () => {
      this.logger.info('[ServerService] SIGINT: останавливаем сервер...');
      await this.server.close();
      this.logger.info('[ServerService] Сервер остановлен.');
      process.exit(0);
    });
  }

  private async registerRoutes(): Promise<void> {
    await this.server.register(routes as FastifyPluginAsync);
  }

  private registerErrorHandler(): void {
    this.server.setErrorHandler(
      (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
        this.logger.error('[ServerService] Ошибка во время обработки запроса', {
          message: error.message,
          stack: error.stack,
          method: request.method,
          url: request.url,
        });
        reply.status(500).send({ error: 'Internal Server Error' });
      },
    );

    process.on('unhandledRejection', (reason: unknown) => {
      this.logger.error('[ServerService] Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (err: Error) => {
      this.logger.error('[ServerService] Uncaught Exception:', {
        message: err.message,
        stack: err.stack,
      });
      process.exit(1);
    });
  }

  public async init(): Promise<void> {
    try {
      await this.registerRoutes();
      await this.server.listen({ host: this.host, port: this.port });
      this.logger.info(`[ServerService] Сервер запущен: http://${this.host}:${this.port}`);
    } catch (error) {
      this.logger.error('[ServerService] Не удалось запустить сервер', {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      process.exit(1);
    }
  }
}
