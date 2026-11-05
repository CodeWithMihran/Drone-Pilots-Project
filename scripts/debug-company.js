const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'company@example.com');
  await page.type('#login-password-input', 'company123');
  await page.click('#login-submit-btn');

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after 4s:', page.url());

  const alertText = await page.evaluate(() => {
    const el = document.querySelector('[role="alert"], .bg-red-50, .text-destructive, [class*="alert"]');
    return el ? el.innerText : null;
  });
  console.log('Alert text on page:', alertText);

  // Check user in database
  await browser.close();
})();
