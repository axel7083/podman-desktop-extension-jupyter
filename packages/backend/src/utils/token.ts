import { randomBytes } from 'node:crypto';

export function generateToken(size: number = 64): string {
  return randomBytes(size).toString('hex');
}
