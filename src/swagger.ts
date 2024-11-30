import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

type OptionType = {
  route: string;
  title: string;
  description: string;
  version: string;
};

export function generateSwaggerApi(app: INestApplication, option: OptionType) {
  const appDocumentSwagger = new DocumentBuilder()
    .setTitle(option.title)
    .setDescription(option.description)
    .setVersion(option.version)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, appDocumentSwagger);
  SwaggerModule.setup(option.route, app, document, {
    customSiteTitle: option.title
  });

  // 生成swagger.json文件
  const directory = path.resolve(process.cwd(), option.route);
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);
  const fileName = path.resolve(directory, 'swagger.json');
  fs.writeFileSync(fileName, JSON.stringify(document));
}

export const basicAuthOptions = {
  challenge: true,
  users: {
    [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD
  }
};
