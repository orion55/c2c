import type {
  AsteriskRequestBody,
  AsteriskResponse,
  BadFields,
  IAsteriskService,
} from '@src/asterisk/asterisk.types';
import { toSimplePhone } from '@src/asterisk/asterisk.util';
import { appContainer } from '@src/inversify.config';
import { TYPES } from '@src/types';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const processingHandler = async (
  request: FastifyRequest<{ Body: AsteriskRequestBody }>,
  reply: FastifyReply,
) => {
  const { user, client } = request.body;

  const verifiedUser = toSimplePhone(user);
  const verifiedClient = toSimplePhone(client);

  const details: BadFields = {};
  if (!verifiedUser) details.user = 'Неверный номер';
  if (!verifiedClient) details.client = 'Неверный номер';

  if (Object.keys(details).length) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Неверные параметры запроса',
      details,
    });
  }

  const asteriskService = appContainer.get<IAsteriskService>(TYPES.AsteriskService);
  await asteriskService.processingCommands({
    user: verifiedUser!,
    client: verifiedClient!,
  });

  const payload: AsteriskResponse = {
    ok: true,
    user: verifiedUser!,
    client: verifiedClient!,
  };
  return reply.code(200).send({ payload });
};
