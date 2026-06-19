import path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = path.resolve();

export function getDir(baseFolder: string = ''): string {
  return process.env.NODE_ENV === 'development'
    ? path.join(__dirname, 'src', baseFolder)
    : path.join(__dirname, baseFolder);
}
