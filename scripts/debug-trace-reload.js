const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('response', res => {
    if (res.url().includes('/api/auth/session')) {
      console.log('SESSION RES:', res.status());
    }
  });

  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'pilot@example.com');
  await page.type('#login-password-input', 'pilot123');
  await page.click('#login-submit-btn');

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (page.url().includes('/pilot/dashboard')) break;
  }
  console.log('On dashboard:', page.url());

  console.log('--- RELOADING PAGE ---');
  await page.reload({ waitUntil: 'domcontentloaded' });

  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const btn = await page.$('#user-profile-menu-btn');
    const signIn = await page.$("header a[href='/login']");
    const getStarted = await page.$("header a[href='/register']");
    console.log(`t=${i+1}s: ProfileBtn=${!!btn}, SignIn=${!!signIn}, GetStarted=${!!getStarted}`);
    if (btn) break;
  }

  await browser.close();
})();
