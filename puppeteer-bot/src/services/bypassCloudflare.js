import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
puppeteer.use(StealthPlugin());

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.127 Safari/537.36',

    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',

    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0'
];

async function bypassCloudflare(url, proxy = '') {
    const browser = await puppeteer.launch({
        executablePath: executablePath(),
        headless: 'new',
        args: [
            proxy ? `--proxy-server=${proxy}` : '',
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ].filter(Boolean),
        ignoreDefaultArgs: ['--enable-automation']
    });

    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.setJavaScriptEnabled(true);

    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    });

    console.log(`🌐 Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const isCloudflare = await page.evaluate(() =>
        document.querySelector('#cf-challenge-form') !== null || document.title.includes('Just a moment...')
    );

    if (isCloudflare) {
        console.log('🔐 Solving Cloudflare challenge...');
        await page.waitForSelector('#cf-challenge-form', { timeout: 15000 });
        await page.mouse.move(Math.random() * 400 + 100, Math.random() * 300 + 100);
        await page.mouse.click(Math.random() * 400 + 100, Math.random() * 300 + 100, { delay: Math.random() * 100 + 50 });
        await page.waitForFunction(() => document.title.indexOf('Just a moment...') === -1, { timeout: 30000 });
    }

    console.log('✅ Cloudflare bypassed successfully!');
    return { browser, page };
}

export default bypassCloudflare;