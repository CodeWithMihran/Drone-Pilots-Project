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

  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login-email-input');
  
  // Type email and password
  await page.focus('#login-email-input');
  await page.keyboard.type('pilot@example.com', { delay: 20 });
  await page.focus('#login-password-input');
  await page.keyboard.type('pilot123', { delay: 20 });

  const inputVals = await page.evaluate(() => ({
    email: document.querySelector('#login-email-input').value,
    pass: document.querySelector('#login-password-input').value
  }));
  console.log('Input values:', inputVals);

  // Click submit
  await page.click('#login-submit-btn');
  console.log('Clicked submit');

  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const status = await page.evaluate(() => {
      const alert = document.querySelector('[role="alert"], .text-destructive, .text-rose-500');
      const submitBtn = document.querySelector('#login-submit-btn');
      return {
        url: window.location.href,
        btnText: submitBtn ? submitBtn.innerText : 'NO BTN',
        alertText: alert ? alert.innerText : null
      };
    });
    console.log(`Sec ${i+1}:`, status);
  }

  await browser.close();
})();
