import puppeteer from 'puppeteer';
import logger from '../../services/logger.js';
import createProxyService  from '../../services/proxyService.js';
import { waitForElement, randomDelay } from '../../utils/helpers.js';
import { readFile } from 'fs/promises';

const config = JSON.parse(
  await readFile(new URL('../../../config/glassdoor.json', import.meta.url))
);

export default async function login(user, proxies, retryCount = 3) {
  const proxyService = createProxyService(proxies);
  const { args, proxyCredentials } = await proxyService.rotateProxy();

  logger.info(`Using proxy: ${proxyCredentials.username}@${args[0].split('=')[1]}`);

  const browser = await puppeteer.launch({
    headless: false, 
    args,
  });
  const page = await browser.newPage();

  try {
    if (proxyCredentials) {
      await page.authenticate({
        username: proxyCredentials.username,
        password: proxyCredentials.password,
      });
    }

    await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });
    await waitForElement(page, config.selectors.email);
    await randomDelay(1000, 3000);
    await page.type(config.selectors.email, user.email);

    await waitForElement(page, config.selectors.password);
    await randomDelay(1000, 3000);
    await page.type(config.selectors.password, user.password);

    await waitForElement(page, config.selectors.submit);
    await randomDelay(1000, 3000);
    await page.click(config.selectors.submit);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    logger.info(`Logged in as ${user.email}`);
  } catch (error) {
    logger.error(`Login failed for ${user.email}: ${error.message}`);

    if (retryCount > 0) {
      logger.info(`Retrying login for ${user.email} (${retryCount} retries remaining)...`);
      await browser.close();
      return login(user, proxies, retryCount - 1);
    } else {
      logger.error(`Max retries reached for ${user.email}. Giving up.`);
    }
  } finally {
    // Comment this line to keep the browser open after the script finishes
    // await browser.close();
  }
}