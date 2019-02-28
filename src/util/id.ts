import nanoid from 'nanoid/generate';

export function generateId() {
  return nanoid('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
}
