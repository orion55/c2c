import { existsSync } from 'node:fs';
import path from 'node:path';
import fastifyStatic from '@fastify/static';
import type { FastifyPluginAsync } from 'fastify';

const pageAssetDirs = [
  path.join(__dirname, 'indexPage'),
  path.join(process.cwd(), 'dist', 'indexPage'),
  path.join(process.cwd(), 'src', 'server', 'routes', 'indexPage'),
];

const resolvePageAssetDir = (): string => {
  const assetDir = pageAssetDirs.find((dir) => existsSync(path.join(dir, 'index.html')));

  if (!assetDir) {
    throw new Error(`Не удалось найти файлы главной страницы: ${pageAssetDirs.join(', ')}`);
  }

  return assetDir;
};

const pageAssetDir = resolvePageAssetDir();

const indexRoute: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyStatic, {
    root: pageAssetDir,
    prefix: '/',
    index: false,
  });

  fastify.get(
    '/',
    {
      schema: {
        description: 'Main page',
        params: {},
      },
    },
    async (_request, reply) => {
      return reply.type('text/html; charset=utf-8').sendFile('index.html');
    },
  );
};

export default indexRoute;
