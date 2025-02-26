import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import fs from 'fs-extra';
dotenv.config();
puppeteer.use(StealthPlugin());

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.127 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0'
];

class IndeedScraper {
  constructor() {
    this.browser = null;
    this.proxyIndex = 0;
  }

  async initializeBrowser() {
    const proxies = process.env.PROXIES ? process.env.PROXIES.split(',') : [];
    const proxy = proxies[this.proxyIndex] || '';
    
    return puppeteer.launch({
      executablePath: executablePath(),
      headless: 'new',
      args: [
        proxy ? `--proxy-server=${proxy}` : '',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ].filter(Boolean),
      ignoreDefaultArgs: ['--enable-automation']
    });
  }

  async solveCloudflare(page) {
    try {
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
      });
      await page.setViewport({
        width: 1280,
        height: 720,
        deviceScaleFactor: 1
      });

      if (await this.isCloudflareChallenge(page)) {
        console.log('🔐 Solving Cloudflare challenge...');
        await page.waitForTimeout(10000);
      }
      return !(await this.isCloudflareChallenge(page));
    } catch (error) {
      console.error('Cloudflare bypass failed:', error);
      return false;
    }
  }

  async isCloudflareChallenge(page) {
    return page.evaluate(() => {
      return document.title.includes('Just a moment...');
    });
  }

  async scrape(url) {
    try {
      if (!this.browser) {
        this.browser = await this.initializeBrowser();
      }
      const page = await this.browser.newPage();
      await page.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]);
      
      let allJobs = [];
      let start = 0;
      while (allJobs.length < 100) {
        let paginatedUrl = url.replace(/start=\d+/, `start=${start}`);
        console.log(`🌐 Navigating to ${paginatedUrl}`);
        await page.goto(paginatedUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        if (!(await this.solveCloudflare(page))) {
          throw new Error('Failed to bypass Cloudflare');
        }
        
        await page.waitForSelector('.job_seen_beacon', { timeout: 15000 });
        
        const newJobs = await page.evaluate(() => {
          return [...document.querySelectorAll('.job_seen_beacon')].map(job => ({
            title: job.querySelector('h2 a')?.innerText.trim(),
            link: job.querySelector('h2 a')?.href,
            company: job.querySelector('.companyName')?.innerText.trim(),
            location: job.querySelector('.companyLocation')?.innerText.trim(),
            salary: job.querySelector('.salary-snippet')?.innerText.trim() || 'Not specified',
            description: job.querySelector('.job-snippet')?.innerText.trim(),
            posted: job.querySelector('.date')?.innerText.trim()
          })).filter(job => job.title && job.company);
        });

        allJobs.push(...newJobs);
        console.log(`✅ Collected ${allJobs.length} jobs so far.`);
        
        if (newJobs.length === 0) break;
        start += 20;
        await this.randomDelay(2000, 4000);
      }
      await page.close();
      return allJobs.slice(0, 100);
    } catch (error) {
      console.error(`⚠️ Error: ${error.message}`);
      await this.rotateIdentity();
      return this.scrape(url);
    }
  }

  async rotateIdentity() {
    this.proxyIndex = (this.proxyIndex + 1) % (process.env.PROXIES?.split(',').length || 1);
    await this.browser.close();
    this.browser = await this.initializeBrowser();
  }

  async run(url) {
    try {
      const data = await this.scrape(url);
      await fs.writeJson('indeed_jobs_data.json', data, { spaces: 2 });
      console.log('✅ Scraping completed successfully!');
      console.log(`💾 Total jobs saved: ${data.length}`);
    } finally {
      await this.browser?.close();
    }
  }

  randomDelay(min, max) {
    return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
  }
}

const URL = 'https://in.indeed.com/jobs?q=jobs+for+freshers&l=India&radius=25&fromage=7&start=0';
new IndeedScraper().run(URL).catch(console.error);
