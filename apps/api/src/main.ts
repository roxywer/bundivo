import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1', { exclude: ['health'] })

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      /\.vercel\.app$/,
      'http://localhost:3000',
    ],
    credentials: true,
  })

  app.getHttpAdapter().get('/health', (_req: any, res: any) => res.json({ status: 'ok' }))

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const config = new DocumentBuilder()
    .setTitle('Bundivo API')
    .setDescription('Shared subscription payment platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`🚀 Bundivo API running on http://localhost:${port}/api/v1`)
  console.log(`📖 Swagger docs at http://localhost:${port}/docs`)
}

bootstrap()
