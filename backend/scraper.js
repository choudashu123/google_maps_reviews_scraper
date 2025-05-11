import puppeteer from "puppeteer";

export async function scrapeReviews(url) {
    const browser = await puppeteer.launch({ headless : 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2'});

    try {
        await page.waitForSelector('[aria-label^=" reviews"]', { timeout: 5000 });
        await page.click('[aria-label^=" reviews"]');
        await page.waitForTimeout(2000);
    } catch (e) {
        console.log("Reviews button not found, assuming already open");
    }

    await autoScroll(page);
    const reviews = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.jftiEf'))
        .slice(0, 10)
        .map(node => ({
            name: node.querySelector('.d4r55')?.innerText,
            rating: node.querySelector('.kvMYJc')?.getAttribute('aria-label'),
            date: node.querySelector('.rsqaWe')?.innerText,
            text: node.querySelector('.wiI7pd')?.innerText,
        }));
    });
    await browser.close();
    return reviews;
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        const scrollableSelection = document.querySelector('div[aria-label="Reviews"]')
        for (let i= 0; i<5; i++){
            scrollableSelection.scrollBy(0, 500);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    });
}