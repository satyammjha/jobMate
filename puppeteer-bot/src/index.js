import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') });

console.log('ENV LOADED:', process.env.PROXIES);

const PROXIES = process.env.PROXIES ? process.env.PROXIES : [];

import { readFile } from 'fs/promises';
import naukriLogin from './bots/naukri/login.js';
import glassdoorLogin from './bots/glassdoor/login.js';

const users = JSON.parse(
  await readFile(new URL('../config/users.json', import.meta.url))
);

(async () => {
  for (const user of users) {
    await glassdoorLogin(user, PROXIES);
  }
})();