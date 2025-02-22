import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import logger from '../../services/logger.js';
import createProxyService from '../../services/proxyService.js';
import { waitForElement, randomDelay } from '../../utils/helpers.js';
import { readFile } from 'fs/promises';
import  bypassCloudflare  from '../../services/bypassCloudflare.js'; 

puppeteer.use(StealthPlugin());

const config = JSON.parse(
  await readFile(new URL('../../../config/naukri.json', import.meta.url))
);

export default async function login(user, proxies, retryCount = 3) {
  if (!user.naukri.id || !user.naukri.password) {
    logger.error("❌ User credentials missing.");
    return;
  }

  const proxyService = createProxyService(proxies);
  const { args, proxyCredentials } = await proxyService.rotateProxy();
  logger.info(`🌐 Using proxy: ${proxyCredentials.username}@${args[0].split('=')[1]}`);

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

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
    await page.setViewport({ width: 1366, height: 768 });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    logger.info(`🔄 Bypassing Cloudflare for ${config.loginUrl}`);
    const cloudflareContent = await bypassCloudflare(config.loginUrl, args[0]);

    if (!cloudflareContent) {
      throw new Error('❌ Cloudflare bypass failed');
    }

    await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });

    await waitForElement(page, config.selectors.username);
    await randomDelay(1000, 3000);
    await page.type(config.selectors.username, user.naukri.id, { delay: 100 + Math.random() * 100 });

    await waitForElement(page, config.selectors.password);
    await randomDelay(1000, 3000);
    await page.type(config.selectors.password, user.naukri.password, { delay: 100 + Math.random() * 150 });

    await waitForElement(page, config.selectors.submit);
    await randomDelay(1000, 3000);
    await page.mouse.move(Math.random() * 400, Math.random() * 400);
    await page.waitForTimeout(200);
    await page.mouse.move(Math.random() * 500, Math.random() * 500);
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      window.scrollBy(0, Math.floor(Math.random() * 100));
    });

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 100000 }),
      page.click(config.selectors.submit),
    ]);

    logger.info(`✅ Logged in as ${user.naukri.email}`);
  } catch (error) {
    logger.error(`❌ Login failed for ${user.naukri.email}: ${error.message}`);

    if (retryCount > 0) {
      logger.info(`🔄 Retrying login for ${user.naukri.email} (${retryCount} retries remaining)...`);
      await browser.close();
      return login(user, proxies, retryCount - 1);
    } else {
      logger.error(`⛔ Max retries reached for ${user.naukri.email}. Giving up.`);
    }
  } finally {
    await browser.close();
  }
}
