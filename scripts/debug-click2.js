const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'pilot@example.com');
  await page.type('#login-password-input', 'pilot123');
  await page.click('#login-submit-btn');
  await new Promise(r => setTimeout(r, 3000));

  console.log('Page URL:', page.url());
  const beforeHtml = await page.evaluate(() => {
    const el = document.querySelector('#user-profile-menu-btn')?.parentElement;
    return el ? el.outerHTML : 'NOT FOUND';
  });
  console.log('Before click outerHTML:\n', beforeHtml);

  // Click using mouse click at coordinates
  const btn = await page.$('#user-profile-menu-btn');
  const box = await btn.boundingBox();
  console.log('Clicking at:', box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 1000));

  const afterHtml = await page.evaluate(() => {
    const el = document.querySelector('#user-profile-menu-btn')?.parentElement;
    return el ? el.outerHTML : 'NOT FOUND';
  });
  console.log('After click outerHTML:\n', afterHtml);

  await browser.close();
})();
