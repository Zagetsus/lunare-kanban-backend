import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from '~/app.module';
import { APP_PORT, APP_VERSION, APP_VERSION_PREFIX } from './app.vars';
import { AppLogger, DefaultExceptionsFilter } from './config';
import { enableCors } from './cors.service';
import { enableSwagger } from './swagger.service';

function bootstrap() {
  NestFactory.create(AppModule, new ExpressAdapter(), {
    logger: new AppLogger()
  })
    .then(async app => {
      app.enableVersioning({
        type: VersioningType.URI,
        prefix: APP_VERSION_PREFIX,
        defaultVersion: APP_VERSION
      });

      app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          forbidUnknownValues: true
        })
      );

      enableCors(app);
      enableSwagger(app);

      app.useGlobalFilters(new DefaultExceptionsFilter());

      app.use(helmet());
      app.use(rateLimit({ windowMs: 60 * 1000, max: 1000 }));

      const port = APP_PORT ?? 3000;

      await app.listen(port, () => {
        Logger.verbose(`Lunare listing at http://localhost:${port}️`, 'Main');
      });
    })
    .catch(error => Logger.error(error));
}

bootstrap();
