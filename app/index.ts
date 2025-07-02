import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const server = fastify();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

server.get('/ping', async (_, reply) => {
  try {
    await prisma.counter.create({
      data: {},
    });

    const count = await prisma.counter.count();

    return reply.status(200).send({ count });
  } catch (error: any) {
    return reply.status(500).send({ error: error?.message });
  }
});


server.get('/pong', async (_, reply) => {
  try {
    // Find the latest entry by ordering by 'createdAt' in descending order
    const latestEntry = await prisma.counter.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestEntry) {
      return reply.status(404).send({ message: 'No entries to delete.' });
    }

    // Delete the latest entry using its id
    await prisma.counter.delete({
      where: {
        id: latestEntry.id,
      },
    });

    const count = await prisma.counter.count();

    return reply.status(200).send({ message: 'Latest entry deleted.', count });
  } catch (error: any) {
    return reply.status(500).send({ error: error?.message });
  }
});

server.listen({
  host: HOST,
  port: Number(PORT),
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`)
});
