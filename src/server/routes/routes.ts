import asteriskRoute from '@src/asterisk/asterisk.route';
import type { FastifyPluginAsync } from 'fastify';
import indexRoute from './indexRoute';

const routes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(indexRoute);
  await fastify.register(asteriskRoute);
};

export default routes;
