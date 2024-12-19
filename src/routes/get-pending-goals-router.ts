import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from '../functions/get-week-pending-goals';
import z from 'zod';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'getWeekPendingGoals',
        tags: ['goals'],
        description: 'Get pending goals',
        response: {
          200: z.object({
            pendingGoals: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number(),
                completionCount: z.number(),
              })
            ),
          }),
        },
      },
    },
    async request => {
      const userId = request.user.sub;
      const { pendingGoals } = await getWeekPendingGoals({
        userId,
      });

      return { pendingGoals };
    }
  );
};
