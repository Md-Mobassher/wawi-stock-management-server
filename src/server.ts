

import app from '@/app';
import config from '@/app/config';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';

const prisma = new PrismaClient();

async function bootstrap() {
  let server: Server;

  try {
    await prisma.$connect();
    console.log('Database connection established');
      // Start the server
    server = app.listen(5000, '127.0.0.1', () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack}`
        : String(error);

    console.error(`Failed to bootstrap the application: ${errorMessage}`);
    process.exit(1); 
  }

  const exitHandler = () => {
    if (server) {
      server.close(async () => {
        console.log('Server closed');
        await prisma.$disconnect(); 
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown): void => {
    const errorMessage =
      error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack}`
        : String(error);
    console.error(errorMessage);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
}

bootstrap();
