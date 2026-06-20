import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
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
const readPageAsset = (filename: string): string =>
  readFileSync(path.join(pageAssetDir, filename), 'utf8');

const html = readPageAsset('index.html');
const css = readPageAsset('index.css');
const js = readPageAsset('index.js');

const indexRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        description: 'Main page',
        params: {},
      },
    },
    async (_request, reply) => {
      return reply.type('text/html; charset=utf-8').send(html);
    },
  );

  fastify.get(
    '/index.css',
    {
      schema: {
        description: 'Main page styles',
        params: {},
      },
    },
    async (_request, reply) => {
      return reply.type('text/css; charset=utf-8').send(css);
    },
  );

  fastify.get(
    '/index.js',
    {
      schema: {
        description: 'Main page script',
        params: {},
      },
    },
    async (_request, reply) => {
      return reply.type('application/javascript; charset=utf-8').send(js);
    },
  );
};

export default indexRoute;
