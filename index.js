const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.amazon.com.mx');
  await page.screenshot({ path: 'amazon.jpg' });

  await page.type('#twotabsearchtextbox', 'libros de javascript');
  await page.screenshot({ path: 'amazon2.jpg' });

  await page.click('.nav-search-submit input');
  await page.waitForSelector('[data-component-type=s-search-result]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'amazon3.jpg' });

  const enlaces = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      '[data-component-type=s-search-result] h2 a'
    );

    const links = [];
    for (let element of elements) {
      links.push(element.href);
    }
    return links;
  });

  const books = [];
  for (let enlace of enlaces) {
    await page.goto(enlace);
    await page.waitForSelector('#productTitle');

    const book = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector('#productTitle').innerText;
      tmp.author = document.querySelector('.author a').innerText;
      return tmp;
    });
    books.push(book);
  }

  console.log(books);

  await browser.close();
})();
