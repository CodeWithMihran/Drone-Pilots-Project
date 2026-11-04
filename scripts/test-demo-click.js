const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('button');
  
  // Click 'Use a demo account'
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Use a demo account'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click 'Pilot' button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Pilot');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('Values:', await page.evaluate(() => ({
    email: document.querySelector('#login-email-input').value,
    pass: document.querySelector('#login-password-input').value
  })));

  await page.click('#login-submit-btn');

  for (let i = 0; i < 6; i++) {
    await new Promise(r => setTimeout(r, 1000));
    console.log(`t=${i+1}s: ${page.url()}`);
    if (page.url().includes('/pilot/dashboard')) break;
  }
  await browser.close();
})();
