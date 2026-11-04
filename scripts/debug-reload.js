const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  // Login as pilot
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login-email-input');
  await page.focus('#login-email-input');
  await page.keyboard.type('pilot@example.com', { delay: 10 });
  await page.focus('#login-password-input');
  await page.keyboard.type('pilot123', { delay: 10 });
  await page.click('#login-submit-btn');

  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (page.url().includes('/pilot/dashboard')) break;
  }
  console.log('Logged in URL:', page.url());

  // Reload page
  console.log('Reloading page...');
  await page.reload({ waitUntil: 'domcontentloaded' });

  // Immediately check: are Sign in or Get started visible?
  const immediateFlash = await page.evaluate(() => {
    return {
      signIn: !!document.querySelector("header a[href='/login']"),
      getStarted: !!document.querySelector("header a[href='/register']"),
      skeleton: !!document.querySelector("header .animate-pulse"),
      profileBtn: !!document.querySelector("#user-profile-menu-btn")
    };
  });
  console.log('Immediate check right after reload:', immediateFlash);

  // Wait for profile button
  await page.waitForSelector('#user-profile-menu-btn', { timeout: 10000 });
  console.log('Profile button successfully appeared after session resolved!');

  const finalCheck = await page.evaluate(() => {
    return {
      signIn: !!document.querySelector("header a[href='/login']"),
      getStarted: !!document.querySelector("header a[href='/register']"),
      profileBtn: !!document.querySelector("#user-profile-menu-btn")
    };
  });
  console.log('Final check after session resolved:', finalCheck);

  await browser.close();
})();
