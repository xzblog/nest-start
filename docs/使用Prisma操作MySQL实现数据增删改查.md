> Prisma 是一个ORM库， 使用它，我们就可以以操作对象的方式去操作数据库， 而不用直接编写SQL

## 安装 Prisma

```bash
pnpm install prisma --save-dev
```

安装后运行

```
pnpm prisma init
```

执行完成之后会在项目根目录中创建出一个prisma文件夹和 `.env` 文件

在 `prisma/schema.prisma` 中我们可以使用 `model` 关键字来定义模型，一个模型对应数据库的一个表。

**常用场景：**

1. 手动定义或修改数据模型，然后运行 `pnpm prisma migrate dev` 同步到数据库
2. 手动定义或修改数据库，然后运行 `pnpm prisma db pull` 同步到数据模型

我们以mysql为例：  定义了了一个User 和 Note model

```typescript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(uuid())
  username String
  password String
  notes    Note[]
}

model Note {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

```

先到MySQL中创建一个数据库，然后执行

```
pnpm prisma migrate dev --name init
```

然后你就可以在数据库中看到创建了两个表 `User` `Note`

后续如果在数据库端直接修改了某个表， 只需要执行

```
pnpm prisma db pull
```

就可以将数据库新增的字段同步到schema.prisma 文件的对应Model 中。但通常我们更新了schema 后还需要执行 `prisma generate` 同步 Prisma Client 。



## 深入 Prisma

### Schema

```
model User {
  id       String @id @default(uuid())
}
```

模型的每个字段都包含

- 字段名称
- 字段类型
- （可选）[类型修饰符](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Fprisma-schema%2Fdata-model%2Fmodels%23type-modifiers)（type modifiers）
- （可选）[属性](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Fprisma-schema%2Fdata-model%2Fmodels%23defining-attributes)（attributes）

#### 字段类型

其中，字段类型有 `String`、`Boolean`、`Int`、`BigInt`、`Float`、`Decimal`（存储精确小数值）、`DateTime`、`Json`、`Bytes`（存储文件）、`Unsupported`。字段类型还可以是数据库底层数据类型，通过 `@db.` 描述，比如 `@db.VarChar(255)`, varchar 正是 MySQL 支持的底层数据类型。

#### 类型修饰符

1. `[]` 表示字段是数组
2. `?` 表示字段可选

```typescript
model User {
  name String?
  favoriteColors String[]
}
```

#### 属性

`@id @default(uuid())` 则表示属性了。属性的作用是修改字段或model 的行为，影响字段用 `@` 符号， 影响model 用 `@@` 符号

```typescript
model User {
  id        Int    @id @default(autoincrement())
  firstName String @map("first_name")
  @@map("users")
}
```

`@map` 的作用是映射

- `@map("first_name")` 表示`firstName` 字段映射数据库中的 `first_name` 字段
- `@@map("users")`表示 `User` 映射数据库的中的 `users` 表

**具体影响字段的属性有**：

1. [@id](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23id)（设置主键 `PRIMARY KEY`）
2. [@default](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23default)（设置字段默认值）
3. [@unique](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23unique)（唯一约束，表示该字段值唯一，设置后可以用 `findUnique` 来查找）
4. [@relation](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23relation)（设置外键 `FOREIGN KEY`/ `REFERENCES`，用于建立表与表之间的关联，很重要的概念，下节会具体讲）
5. [@map](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23map)（映射数据库中的字段）
6. [@updatedAt](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23updatedat)（自动存储记录更新的时间）
7. [@ignore](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23ignore)（该字段会被忽略，不会生成到 Prisma Client 中）

**影响块的属性有：**

1. [@@id](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23id-1)：相当于关系型数据库中复合主键
2. [@@unique](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23unique-1)：复合唯一约束
3. [@@index](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23index)：创建数据库索引
4. [@@map](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23map-1)：映射数据库表名
5. [@@ignore](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23ignore-1)：忽略此模型

```
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
  @@unique([firstName, lastName])
  @@index：创建数据库索引
}
```

#### 属性函数

`@default(autoincrement())` 类似 `autoincrement()` 这样的函数称为属性函数

属性函数有如下几个

1. [auto()](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23auto)：由数据库自动生成，只用于 Mongodb 数据库（因为 Mongodb 的 _id 是自动生成的）：
2. [autoincrement()](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23autoincrement)：自动增长，只用于关系型数据库
3. [cuid()](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23cuid)：基于 [cuid ](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fparalleldrive%2Fcuid)规范生成唯一标识符，适用于浏览器环境中（示例：tz4a98xxat96iws9zmbrgj3a）
4. [uuid()](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23uuid)：基于 [uuid](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FUniversally_unique_identifier) 规范生成唯一标识符（示例：9c5b94b1-35ad-49bb-b118-8e8fc24abf80）
5. [now()](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23now)：创建记录的时间戳
6. [dbgenerated()](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23dbgenerated)：无法在 Prisma schema 中表示的默认值（如 random()）
7. 除此之外，还有一个 [enum](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-schema-reference%23enum) 类型，

```
enum Role {
  USER
  ADMIN
}

model User {
  role Role @default(USER)
}
```



### Relations

用于关联Model ， 也就是用于多表联合查询

#### 一对多

```
model User {
  id       String @id @default(uuid())
  notes    Note[]
}

model Note {
  id        String   @id @default(cuid())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

如上例，一个用户对应多篇文章，我们需要到User 中添加 `notes Note[]`

Note 的 author 字段指向 User，其中 `@relation(fields: [authorId], references: [id])`表示 Note 的 authorId 字段与 User 的 id 字段建立关系，**也就是这两个字段的值应该是一致的**。

更多用法参考： https://juejin.cn/book/7307859898316881957/section/7324318994751488026?utm_source=course_list



### Prisma Client

学习 Prisma Client，也就是学习具体如何操作数据库。完整的 API 参考 [Prisma Client API reference](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference)。

```
pnpm install @prisma/client
```

⚠️： 我们在每次改了数据库之后，pull 到本地后， 需要执行 `prisma generate` 来更新 prisma client。

####  查询函数

查询函数有：

1. 增：`create()`、`createMany()`
2. 删：`delete()`、`deleteMany()`
3. 改：`update()`、`upsert()`（找不到就创建）、`updateMany()`
4. 查：`findUnique()`(需要有 @unique 属性)、`findUniqueOrThrow()`（找不到就报错）、`findFirst()`（找第一个）、`findFirstOrThrow()`（找不到就报错）、`findMany()`
5. 其他：`count()`、`aggregate()`（聚合）、`groupBy()`

#### 查询参数

其查询参数除了 `where` 用于条件查找之外，还有：

1. `include` 用于定义返回的结果中包含的关系
2. `select` 用于选择返回的字段
3. `orderBy` 用于排序
4. `distinct` 用于去重

#### 嵌套查询

在嵌套查询里，有：[create](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23create-1)、[createMany](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23createmany-1)、[set](https://juejin.cn/book/7307859898316881957/section/set)、[connect](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23connect)、[connectOrCreate](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23connectorcreate)、[disconnect](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23disconnect)、[update](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23update-1)、[upsert](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23upsert-1)、[delete](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23delete-1)、[updateMany](https://juejin.cn/book/7307859898316881957/section/updateMany)、[deleteMany](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23deletemany-1)，也就是如何处理关系表中的数据

#### 筛选条件

筛选条件支持 [equals](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23equals)、[not](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23not)、[in](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23in)、[notIn](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23notin)、[lt](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23lt)、[lte](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23lte)、[gt](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23gt)、[gte](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23gte)、[contains](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23contains)、[search](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23search)、[mode](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23mode)、[startsWith](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23startswith)、[endsWith](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23endswith)、[AND](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23and)、[OR](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23or)、[NOT](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23not-1)

#### Relation filters

最后还有 Relation filters，有 [some](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23some)、[every](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23every)、[none](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23none)、[is](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23is)、[isNot](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Form%2Freference%2Fprisma-client-reference%23isnot)

