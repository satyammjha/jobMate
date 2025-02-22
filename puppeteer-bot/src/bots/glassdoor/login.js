import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import logger from '../../services/logger.js';
import createProxyService from '../../services/proxyService.js';
import { waitForElement, randomDelay } from '../../utils/helpers.js';
import bypassCloudflare from '../../services/bypassCloudflare.js';

dotenv.config();
puppeteer.use(StealthPlugin());

const CLOUDFLARE_OPTIONS = {
  headless: 'new',
  stealthOptions: {
    webDriver: false,
    chromeApp: false,
    chromeRuntime: false,
  },
};

console.log("Reached Glassdoor login function");

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.127 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0'
];

const config = JSON.parse(
  await fs.readFile(new URL('../../../config/glassdoor.json', import.meta.url))
);

export default async function login(user, proxies, retryCount = 3) {
  if (!user.glassdoor.id || !user.glassdoor.password) {
    logger.error("❌ Missing login credentials.");
    return;
  }

  const proxyService = createProxyService(proxies);
  const { args, proxyCredentials } = await proxyService.rotateProxy();

  logger.info(`🌐 Using proxy: ${proxyCredentials.username}@${args[0].split('=')[1]}`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      ...args,
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1200,800',
    ],
    ignoreDefaultArgs: ['--enable-automation'],
  });

  const page = await browser.newPage();

  try {
    if (proxyCredentials) {
      await page.authenticate({
        username: proxyCredentials.username,
        password: proxyCredentials.password,
      });
    }

    await page.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]);
    await page.setViewport({ width: 1200, height: 800 });

    await page.evaluateOnNewDocument(() => {
      delete navigator.__proto__.webdriver;
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
      Object.defineProperty(navigator, 'mimeTypes', { get: () => [1, 2, 3] });
    });

    logger.info(`🔄 Bypassing Cloudflare for ${config.loginUrl}`);
    const cloudflareContent = await bypassCloudflare(config.loginUrl, args[0]);

    if (!cloudflareContent) {
      throw new Error('❌ Cloudflare bypass failed');
    }

    await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });

    console.log("⏳ Waiting 7 seconds before interacting with the page");
    await page.waitForTimeout(7000);

    await waitForElement(page, config.selectors.email);
    await page.click(config.selectors.email);
    console.log("⏳ Waiting 7 seconds before typing email");
    await page.waitForTimeout(7000);
    await page.keyboard.type(user.glassdoor.id, { delay: Math.random() * 100 + 50 });

    await waitForElement(page, config.selectors.password);
    await page.click(config.selectors.password);
    console.log("⏳ Waiting 7 seconds before typing password");
    await page.waitForTimeout(7000);
    await page.keyboard.type(user.glassdoor.password, { delay: Math.random() * 100 + 50 });

    await waitForElement(page, config.selectors.loginButton);
    console.log("⏳ Waiting 7 seconds before clicking login button");
    await page.waitForTimeout(7000);
    await page.click(config.selectors.loginButton);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    logger.info('✅ Login successful');
    return page;
  } catch (error) {
    logger.error(`❌ Login failed: ${error.message}`);

    await browser.close();
    if (retryCount > 0) {
      logger.info(`🔄 Retrying login (${retryCount} attempts left)...`);
      return login(user, proxies, retryCount - 1);
    }

    logger.error('⛔ Max retries reached. Giving up.');
    throw error;
  }
}
