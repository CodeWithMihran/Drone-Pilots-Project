const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));

  // Test 1: Go to /
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('header');
  console.log('Test 1 done. URL:', page.url());

  // Test 2: Go to /login
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'pilot@example.com', { delay: 10 });
  await page.type('#login-password-input', 'pilot123', { delay: 10 });
  await page.click('#login-submit-btn');

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (page.url().includes('/pilot/dashboard')) break;
  }
  console.log('Test 2 done. URL:', page.url());
  const btn2 = await page.$('#user-profile-menu-btn');
  console.log('Test 2 profile btn exists:', !!btn2);

  // Test 3: Reload
  console.log('Test 3: reloading...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  console.log('After reload, URL is:', page.url());

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const btn = await page.$('#user-profile-menu-btn');
    const headerHtml = await page.evaluate(() => document.querySelector('header')?.innerText);
    console.log(`t=${i+1}s: btn=${!!btn}, headerText=${JSON.stringify(headerHtml)}`);
    if (btn) break;
  }

  await browser.close();
})();
