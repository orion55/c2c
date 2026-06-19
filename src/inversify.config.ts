import { AsteriskService } from '@src/asterisk/asterisk.service';
import type { IAsteriskService } from '@src/asterisk/asterisk.types';
import type { IConfigService } from '@src/config/config.interface';
import { ConfigService } from '@src/config/config.service';
import type { ILogger } from '@src/logger/logger.interface';
import { LoggerService } from '@src/logger/logger.service';
import { Server } from '@src/server/server.service';
import { TYPES } from '@src/types';
import { Container, ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

export const appBindings = new ContainerModule((options: ContainerModuleLoadOptions) => {
  options.bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  options.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  options.bind<IAsteriskService>(TYPES.AsteriskService).to(AsteriskService);
  options.bind<Server>(TYPES.Server).to(Server);
});

const appContainer = new Container();
appContainer.load(appBindings);

export { appContainer };
