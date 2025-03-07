import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import fs from 'fs-extra';
dotenv.config();
puppeteer.use(StealthPlugin());

const CLOUDFLARE_OPTIONS = {
  browserDebug: false,
  useChromeProfile: true,
  chromeProfilePath: './chrome_profile',
  maxRedirects: 3,
  headless: 'new',
  stealthOptions: {
    webDriver: false,
    chromeApp: false,
    chromeRuntime: false,
  }
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.127 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0'
];

class CloudflareBypasser {
  constructor() {
    this.browser = null;
    this.proxyIndex = 0;
  }

  async initializeBrowser() {
    const proxies = process.env.PROXIES ? process.env.PROXIES.split(',') : [];
    const proxy = proxies[this.proxyIndex] || '';

    return puppeteer.launch({
      executablePath: executablePath(),
      headless: CLOUDFLARE_OPTIONS.headless,
      args: [
        proxy ? `--proxy-server=${proxy}` : '',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        `--user-data-dir=${CLOUDFLARE_OPTIONS.chromeProfilePath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ].filter(Boolean),
      ignoreDefaultArgs: ['--enable-automation']
    });
  }

  async solveCloudflare(page) {
    try {
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
      });

      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: Math.random() * 0.5 + 0.5,
        hasTouch: false,
        isLandscape: false,
        isMobile: false
      });

      await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3]
        });
      });

      let retries = 3;
      while (retries--) {
        if (await this.isCloudflareChallenge(page)) {
          console.log('🔐 Solving Cloudflare challenge...');
          await page.mouse.move(
            Math.random() * 400 + 100,
            Math.random() * 300 + 100
          );
          await page.waitForSelector('#cf-challenge-form', { timeout: 15000 });
          await page.mouse.click(
            Math.random() * 400 + 100,
            Math.random() * 300 + 100,
            { delay: Math.random() * 100 + 50 }
          );
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        } else {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Cloudflare bypass failed:', error);
      return false;
    }
  }

  async isCloudflareChallenge(page) {
    return page.evaluate(() => {
      return document.querySelector('#cf-challenge-form') !== null ||
             document.title.includes('Just a moment...');
    });
  }

  async handleChallenge(page) {
    console.log('🔐 Solving Cloudflare challenge...');
    await page.mouse.move(
      Math.random() * 400 + 100,
      Math.random() * 300 + 100
    );
    await page.waitForSelector('#cf-challenge-form', { timeout: 15000 });
    await page.mouse.click(
      Math.random() * 400 + 100,
      Math.random() * 300 + 100,
      { delay: Math.random() * 100 + 50 }
    );
    await page.waitForFunction(() => {
      return document.title.indexOf('Just a moment...') === -1;
    }, { timeout: 30000 });
  }

  async rotateIdentity() {
    const proxies = process.env.PROXIES ? process.env.PROXIES.split(',') : [];
    this.proxyIndex = (this.proxyIndex + 1) % proxies.length;
    await this.browser.close();
    this.browser = await this.initializeBrowser();
  }

  async scrape(url) {
    try {
      if (!this.browser) {
        this.browser = await this.initializeBrowser();
      }
      const page = await this.browser.newPage();
      await page.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]);
      await page.setJavaScriptEnabled(true);
  
      console.log(`🌐 Navigating to ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
        referer: 'https://www.google.com/'
      });
  
      if (!(await this.solveCloudflare(page))) {
        throw new Error('Failed to bypass Cloudflare');
      }
  
      let allJobs = [];
      let pageNumber = 1;
      let previousCount = 0;
      let samePageCount = 0;
  
      while (allJobs.length < 100) {
        console.log(`📄 Processing page ${pageNumber}`);
        
        await this.scrollPage(page);
        
        const newJobs = await this.extractJobs(page);
        const uniqueJobs = newJobs.filter(job => 
          !allJobs.some(existing => existing.jobId === job.jobId)
        );
        
        if (uniqueJobs.length === 0) {
          console.log('⚠️ No new jobs found, stopping pagination');
          break;
        }
        
        allJobs.push(...uniqueJobs);
        console.log(`✅ Page ${pageNumber}: Added ${uniqueJobs.length} jobs (Total: ${allJobs.length})`);
        
        if (allJobs.length === previousCount) {
          samePageCount++;
          if (samePageCount > 2) {
            console.log('⚠️ Stuck on same page, stopping pagination');
            break;
          }
        } else {
          samePageCount = 0;
          previousCount = allJobs.length;
        }
        const nextSuccess = await this.goToNextPage(page);
        if (!nextSuccess) {
          console.log('⏹️ No more pages available');
          break;
        }
        
        pageNumber++;
        
        if (await this.isCloudflareChallenge(page)) {
          await this.solveCloudflare(page);
        }
  
        if (allJobs.length >= 100) {
          console.log('🎯 Reached target of 100 jobs');
          break;
        }
      }
      
      await page.close();
      return allJobs.slice(0, 100);
    } catch (error) {
      console.error(`⚠️ Error on ${url}: ${error.message}`);
      await this.rotateIdentity();
      return this.scrape(url);
    }
  }

  async scrollPage(page) {
    console.log('🖱️ Scrolling to load all jobs');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = page.viewport().height;
    let currentPosition = 0;
    
    while (currentPosition < scrollHeight) {
      await page.mouse.wheel({ deltaY: Math.random() * 100 + 50 });
      currentPosition += viewportHeight * 0.8;
      await page.waitForTimeout(Math.random() * 500 + 300);
    }
  }

  async extractJobs(page) {
    return page.evaluate(() => {
      const jobs = [];
      const container = document.querySelector('.styles_job-listing-container__OCfZC');
      if (!container) return jobs;

      const items = container.querySelectorAll('.srp-jobtuple-wrapper');
      items.forEach(item => {
        const jobId = item.getAttribute('data-job-id');
        const titleElem = item.querySelector('.row1 h2 a.title');
        const title = titleElem?.innerText?.trim();
        const link = titleElem?.href;
        const logo = item.querySelector('.row1 .imagewrap img.logoImage')?.src;
        const company = item.querySelector('.row2 .comp-dtls-wrap a.comp-name')?.innerText?.trim();
        const experience = item.querySelector('.row3 .exp-wrap span.expwdth')?.getAttribute('title')?.trim();
        const salary = item.querySelector('.row3 .sal-wrap span')?.innerText?.trim();
        const location = item.querySelector('.row3 .loc-wrap span.locWdth')?.getAttribute('title')?.trim();
        const description = item.querySelector('.row4 .job-desc')?.innerText?.trim();
        const tags = Array.from(item.querySelectorAll('.row5 ul.tags-gt li.dot-gt.tag-li'))
          .map(tag => tag.innerText.trim());
        const posted = item.querySelector('.row6 .job-post-day')?.innerText?.trim();

        if (jobId && title && company && link) {
          jobs.push({
            jobId, title, link, logo, company,
            experience, salary, location, description,
            tags, posted
          });
        }
      });
      return jobs;
    });
  }

  async goToNextPage(page) {
    try {
      console.log('➡️ Attempting to go to next page');
      const nextButton = await page.$('a.styles_btn-secondary__2AsIP:not([disabled])');
      
      if (nextButton) {
        await nextButton.scrollIntoView();
        await page.waitForTimeout(1000);
        await nextButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForSelector('.styles_job-listing-container__OCfZC', { timeout: 15000 });
        return true;
      }
      return false;
    } catch (error) {
      console.log('⚠️ Next page navigation failed:', error.message);
      return false;
    }
  }

  async run(urls) {
    try {
      if (!urls.length) {
        console.error("❌ Please provide at least one URL as an argument.");
        process.exit(1);
      }
      const allData = [];
      for (const url of urls) {
        console.log(`🌐 Scraping: ${url}`);
        const data = await this.scrape(url);
        allData.push(...data);
        await fs.writeJson('naukri_jobs_data.json', allData, { spaces: 2 });
      }
      await fs.writeJson('naukri_jobs_data.json', allData, { spaces: 2 });
      console.log('✅ Scraping completed successfully!');
      console.log(`💾 Total jobs saved: ${allData.length}`);
    } finally {
      await this.browser?.close();
    }
  }

  randomDelay(min, max) {
    return new Promise(resolve =>
      setTimeout(resolve, Math.random() * (max - min) + min)
    );
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Please provide at least one URL as an argument.");
  process.exit(1);
}

new CloudflareBypasser().run(args).catch(console.error);