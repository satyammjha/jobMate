

import { readFile } from 'fs/promises';
import naukriLogin from './bots/naukri/login.js';
import glassdoorLogin from './bots/glassdoor/login.js';

const users = JSON.parse(
  await readFile(new URL('../config/users.json', import.meta.url))
);

(async () => {
  for (const user of users) {
    await naukriLogin(user, PROXIES);
    await glassdoorLogin(user, PROXIES);
  }
})();