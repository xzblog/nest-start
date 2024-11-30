import { Account } from '@prisma/client';

// 排除password和salt字段
export type AccountEntity = Pick<Account, Exclude<keyof Account, 'password' | 'salt'>>;
