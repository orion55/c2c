import type { FastifyPluginAsync } from 'fastify';

const indexRoute: FastifyPluginAsync = async (fastify) => {
  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Fastify</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
    h2 { color: #333; }
  </style>
</head>
<body>
  <h2>Демо-приложение для реализации c2c-звонков</h2>
</body>
</html>
`.trim();

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
};

export default indexRoute;
