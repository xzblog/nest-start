## 集成Swagger

Nest 官方已经帮我们集成了swagger，我们只需要简单的引入配置即可使用。

```
pnpm i @nestjs/swagger
```



## 推荐配置

```typescript
// swagger.ts
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

```

```typescript
// main.ts
app.setGlobalPrefix('api');
generateSwaggerApi(app, {
  route: 'api-doc',
  title: '接口文档',
  description: '文档描述',
  version: 'v1.0.0'
});
```

在我们项目中的 `main.ts` 中引入以上代码，然后访问  

`http://localhost:3000/api-doc` 即可看到swagger文档已经准备就绪了。



## 在Swagger 中调试接口

由于我们的大部分接口都需要登录之后才能访问，然后我们在项目中集成了JWT 登录，那么我们要在swagger中调试接口， 则需要使用 `addBearerAuth` 来添加如下配置。

```typescript
.addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'accessToken',
  )
```



## 配置接口描述

当我们仔细查阅文档的时候会发现接口的传参，响应体都是空的，并没有展示出来。 我们还需要在代码中使用如下几个装饰器来装饰下接口以及参数。

- `@ApiTags('用户管理') ` 装饰整个Controller
- `@ApiProperty({ description: '用户名' })` 装饰字段
- `@ApiOperation({ summary: '创建用户' })` 装饰接口







页面 customerAround/getStoreCustomerList: storeId 