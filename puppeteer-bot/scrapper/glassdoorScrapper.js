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
                    await this.handleChallenge(page);
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
    
            await page.setViewport({
                width: 1280 + Math.floor(Math.random() * 100),
                height: 800 + Math.floor(Math.random() * 100),
                deviceScaleFactor: Math.random() * 0.5 + 0.5,
                hasTouch: false,
                isLandscape: false,
                isMobile: false
            });
    
            console.log(`🌐 Navigating to ${url}`);
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 60000,
                referer: 'https://www.google.com/'
            });

            if (!(await this.solveCloudflare(page))) {
                throw new Error('Failed to bypass Cloudflare');
            }
    
            await page.waitForSelector('li.JobsList_jobListItem__wjTHv');
    
            const allJobs = [];
            let hasMoreJobs = true;
    
            while (hasMoreJobs) {
                await page.evaluate(() => {
                    const jobListContainer = document.querySelector('.JobsList_jobListContainer__XYZab');
                    if (jobListContainer) {
                        jobListContainer.scrollTop = jobListContainer.scrollHeight;
                    }
                });
    
                await this.randomDelay(2000, 5000);
    
                const showMoreButton = await page.$('.JobsList_buttonWrapper__ticwb button');
                if (showMoreButton) {
                    await page.mouse.move(Math.random() * 400 + 100, Math.random() * 300 + 100);
                    await showMoreButton.click();
                    await page.waitForSelector('li.JobsList_jobListItem__wjTHv', { visible: true });
                } else {
                    hasMoreJobs = false;
                }
                const jobCards = await page.$$('li.JobsList_jobListItem__wjTHv');
                const maxJobs = 2; 
    
                for (let i = 0; i < Math.min(jobCards.length, maxJobs); i++) {
                    const jobCard = jobCards[i];
    
                    const jobCardData = await page.evaluate((card) => {
                        const employer = card.querySelector('.EmployerProfile_compactEmployerName__9MGcV')?.innerText.trim();
                        const title = card.querySelector('.JobCard_jobTitle__GLyJ1')?.innerText.trim();
                        const location = card.querySelector('.JobCard_location__Ds1fM')?.innerText.trim();
                        const salary = card.querySelector('.JobCard_salaryEstimate__QpbTW')?.innerText.trim();
                        const listingAge = card.querySelector('.JobCard_listingAge__jJsuc')?.innerText.trim();
                        const applyLink = card.querySelector('.JobCard_trackingLink__HMyun')?.href;
                        const imageLink = card.querySelector('.avatar-base_Image__2RcF9')?.src;
    
                        return {
                            employer,
                            title,
                            location,
                            salary,
                            listingAge,
                            applyLink,
                            imageLink
                        };
                    }, jobCard);
    
                    const isRecentJob = this.isJobRecent(jobCardData.listingAge);
                    if (!isRecentJob) {
                        continue; 
                    }

                    await jobCard.click();
                    await page.waitForSelector('.JobDetails_jobDescription__uW_fK', { visible: true });
    
                    const showMoreButton = await page.$('.ShowMoreCTA_showMore__EtZpZ');
                    if (showMoreButton) {
                        await showMoreButton.click();
                        await page.waitForSelector('.JobDetails_jobDescription__uW_fK', { visible: true });
                    }
    
                    const jobDetails = await page.evaluate(() => {
                        const employer = document.querySelector('.EmployerProfile_employerNameHeading__bXBYr h4')?.innerText.trim();
                        const title = document.querySelector('.heading_Level1__soLZs')?.innerText.trim();
                        const location = document.querySelector('.JobDetails_location__mSg5h')?.innerText.trim();
                        const salaryRange = document.querySelector('.SalaryEstimate_salaryRange__brHFy')?.innerText.trim();
                        const medianSalary = document.querySelector('.SalaryEstimate_medianEstimate__fOYN1')?.innerText.trim();
    
                        const descriptionElement = document.querySelector('.JobDetails_jobDescription__uW_fK');
                        const description = descriptionElement ? descriptionElement.innerText.trim() : null;
    
                        return {
                            employer,
                            title,
                            location,
                            salary: {
                                range: salaryRange,
                                median: medianSalary
                            },
                            description 
                        };
                    });
    
                    const combinedJobData = {
                        ...jobCardData,
                        ...jobDetails
                    };
    
                    if (combinedJobData) {
                        allJobs.push(combinedJobData);
                    }
                    await this.randomDelay(2000, 5000);
                }
            }
    
            await page.close();
            return allJobs;
        } catch (error) {
            console.error(`⚠️ Error on ${url}: ${error.message}`);
            await this.rotateIdentity();
            return this.scrape(url);
        }
    }
    isJobRecent(listingAge) {
        if (!listingAge) return false;
        const daysAgo = parseInt(listingAge.match(/\d+/)?.[0], 10);
        if (isNaN(daysAgo)) return false;
        return daysAgo <= 3;
    }

    async run(urls) {
        try {
            if (!urls.length) {
                console.error("❌ No URL provided. Please pass a URL as an argument.");
                process.exit(1);
            }

            const allData = [];

            for (const url of urls) {
                console.log(`🌐 Scraping: ${url}`);
                const data = await this.scrape(url);
                allData.push(...data);
                await fs.writeJson('jobs_data.json', allData, { spaces: 2 });
            }

            console.log('✅ Scraping completed successfully!');
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