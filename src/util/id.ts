import nanoid from 'nanoid/generate';

export function generateId(length = 12) {
  return nanoid('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
}
