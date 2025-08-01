import "dotenv/config";
import "@opentelemetry/auto-instrumentations-node/register";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Observability API')
    .setDescription('API completa com observabilidade, validações e documentação')
    .setVersion('1.0.0')
    .addTag('users', 'Gerenciamento de usuários')
    .setContact(
      'Equipe de Desenvolvimento',
      'https://exemplo.com',
      'dev@exemplo.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Desenvolvimento')
    .addServer('https://api.exemplo.com', 'Produção')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Observability API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  app.getHttpAdapter().get('/api/json', (_, res) => {
    res.json(document);
  });

  app.getHttpAdapter().get('/api/scalar', (_, res) => {
    const html = `
    <!doctype html>
    <html>
      <head>
        <title>Observability API - Scalar</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/api/json"
          data-configuration='{"theme":"purple","layout":"modern","defaultHttpClient":{"targetKey":"javascript","clientKey":"fetch"},"hiddenClients":["ruby","php","python","go","c","csharp","kotlin","swift","dart","powershell","r"]}'></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Aplicação rodando em http://localhost:${port}`);
  console.log(`🚀 Documentação Scalar em http://localhost:${port}/api/scalar`);
  console.log(`🚀Jaeger UI em http://localhost:16686`);
}
bootstrap();
