const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'pilot@example.com');
  await page.type('#login-password-input', 'pilot123');
  await page.click('#login-submit-btn');
  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL:', page.url());

  const btn = await page.$('#user-profile-menu-btn');
  console.log('Btn exists:', !!btn);
  if (btn) {
    const box = await btn.boundingBox();
    console.log('Btn box:', box);

    // Click using puppeteer click
    await page.click('#user-profile-menu-btn');
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if dropdown exists
    const dd = await page.$('#user-profile-menu-btn + div');
    console.log('Dropdown after page.click:', !!dd);

    const html = await page.evaluate(() => document.querySelector('header').innerHTML);
    console.log('Header HTML snippet (last 1200 chars):', html.slice(-1200));
  }
  await browser.close();
})();
