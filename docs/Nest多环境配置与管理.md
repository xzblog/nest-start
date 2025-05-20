# Nest 多环境配置与管理

在 Nestjs 应用开发过程中，不同的运行环境（如开发、测试、生产）往往需要不同的配置。合理地管理多环境配置，不仅能提高开发效率，还能保障应用在不同环境下的稳定运行。`@nestjs/config` 模块为我们提供了强大的多环境配置管理能力，并支持对配置参数进行校验。 接下来让我们看看如何在项目中使用吧。

## 安装 @nestjs/config

首先，我们需要在项目中安装 @nestjs/config 模块。

```
pnpm install @nestjs/config
```

## 创建配置文件

一般情况下，我们会在项目根目录下创建环境配置文件。常见的环境配置文件格式有 .env，并且可以根据不同环境创建多个文件，例如：

- .env.development：开发环境配置

- .env.production：生产环境配置

- .env.test：测试环境配置

假设我们的应用需要配置数据库连接信息和端口号，以 .env.development 为例，其内容可能如下：

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
PORT=3000
```

在实际项目中，你需要根据具体的需求和实际情况进行配置。

## 配置模块注册

接下来，我们要在 AppModule 中注册 ConfigModule。在 app.module.ts 文件中引入 ConfigModule 并进行配置：

```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局模块，这样在其他模块中无需再次导入即可使用
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // 根据当前NODE_ENV环境变量加载对应的.env文件，如果未设置NODE_ENV，则默认加载.env.development
    }),
  ],
})
export class AppModule {}
```

通过上述配置，ConfigModule 会自动读取指定的环境配置文件，并将其中的配置项加载到应用中，供后续使用。

## 获取配置参数

在 Nestjs 中，我们通过 ConfigService 来获取配置参数。在需要使用配置参数的服务或控制器中，通过构造函数注入 ConfigService。例如，在一个 AppService 中获取数据库连接信息和端口号：

```
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getConfigInfo() {
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbPort = this.configService.get<number>('DB_PORT');
    const port = this.configService.get<number>('PORT');
    return {
      dbHost,
      dbPort,
      port,
    };
  }
}
```

在上述代码中，通过 this.configService.get('配置项名称') 方法来获取对应的配置值，并且可以通过泛型指定返回值的类型，以确保类型安全。如果配置项不存在，get 方法会返回 undefined。

## 配置参数校验

为了确保配置参数的正确性，我们可以使用一些校验工具对配置参数进行校验。这里以 joi 为例，joi 是一个强大的用于数据校验的库。

### 安装 joi

```
pnpm install joi
```

### 创建校验 Schema

在项目中创建一个文件用于定义校验规则，例如 src/config/validation-schema.ts：

```
import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
   .valid('development', 'production', 'test')
   .default('development'),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
```

在上述校验规则中：

- NODE_ENV 必须是 development、production 或 test 中的一个，默认值为 development。

- PORT 必须是一个有效的端口号，默认值为 3000。

- 数据库相关的配置项 DB_HOST、DB_PORT、DB_USER、DB_PASSWORD、DB_NAME 都被设置为必填项。

### 应用校验规则

在 AppModule 中应用上述校验规则，修改 app.module.ts 中的 ConfigModule.forRoot 配置：

```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema, // 添加校验Schema
      validationOptions: {
        allowUnknown: true, // 允许存在未在校验Schema中定义的变量
        abortEarly: false, // 收集所有错误后再抛出，而不是遇到第一个错误就终止
      },
    }),
  ],
})
export class AppModule {}
```

通过上述配置，当应用启动时，ConfigModule 会自动使用我们定义的 validationSchema 对加载的环境配置参数进行校验。如果校验不通过，应用将无法启动，并会抛出相应的错误信息，提示哪些配置参数不符合要求。

通过以上步骤，我们实现了在 Nestjs 中使用 @nestjs/config 进行多环境配置管理，并对配置参数进行了校验。这样可以使我们的应用在不同环境下都能正确、稳定地运行，同时保障了配置参数的正确性和安全性。在实际项目中，你可以根据具体需求进一步扩展和优化配置管理和校验逻辑。