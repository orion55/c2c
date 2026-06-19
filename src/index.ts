import 'reflect-metadata';
import { appContainer } from '@src/inversify.config';
import type { Server } from '@src/server/server.service';
import { TYPES } from '@src/types';

const main = async () => {
  const server = appContainer.get<Server>(TYPES.Server);
  await server.init();
};

main();
