import { processingHandler } from '@src/asterisk/asterisk.controller';
import type { FastifyInstance } from 'fastify';

const asteriskRoutes = async (server: FastifyInstance) => {
  server.post('/api/c2c', processingHandler);
};

export default asteriskRoutes;
