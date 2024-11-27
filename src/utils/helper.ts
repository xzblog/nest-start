export const uuid = (): string => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    const index = Math.floor(Math.random() * 0x10);
    s[i] = hexDigits.substring(index, index + 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  const indexStart = (s[19] & 0x3) | 0x8;
  s[19] = hexDigits.substring(indexStart, indexStart + 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  const uuid = s.join('');
  return uuid;
};

/**
 * sha256加密
 * @param str 需要加密的字符
 * @param salt 盐
 * @returns
 */
export const encrypt = async (str: string, salt?: string): Promise<{ password: string; salt: string }> => {
  const { createHmac, randomUUID } = await import('crypto');
  salt = salt || randomUUID();
  const password = createHmac('sha256', salt).update(str).digest('hex');

  return { password, salt };
};

/**
 * 生成指定位数的随机数
 * @param count
 * @returns
 */
export const randomNumber = (count): number => {
  const result = Math.floor(Math.random() * Math.pow(10, count));
  if (result < Math.pow(10, count - 1)) {
    return randomNumber(count);
  }
  return result;
};
