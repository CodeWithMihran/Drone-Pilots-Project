const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('response', res => {
    if (res.url().includes('/api/auth')) {
      console.log('AUTH RES:', res.status(), res.url());
    }
  });

  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'pilot@example.com');
  await page.type('#login-password-input', 'pilot123');
  await page.click('#login-submit-btn');

  for (let i = 0; i < 6; i++) {
    await new Promise(r => setTimeout(r, 1000));
    console.log(`t=${i+1}s:`, page.url());
  }

  await browser.close();
})();
